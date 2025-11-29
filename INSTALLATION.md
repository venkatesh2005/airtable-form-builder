# Installation & Testing Guide

This guide will walk you through setting up and testing the Airtable Form Builder application locally.

## Prerequisites Checklist

Before you begin, ensure you have:

- [ ] Node.js (v14 or higher) installed
- [ ] MongoDB installed and running (or MongoDB Atlas account)
- [ ] Airtable account
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## Step 1: Verify Prerequisites

```powershell
# Check Node.js version
node --version

# Check npm version
npm --version

# Check if MongoDB is installed (if using locally)
mongod --version
```

## Step 2: Create Airtable OAuth Application

1. Go to https://airtable.com/create/oauth
2. Click "Create new OAuth integration"
3. Fill in the details:
   - **Name**: Airtable Form Builder Dev
   - **Redirect URL**: `http://localhost:5000/auth/airtable/callback`
4. Select scopes:
   - ✅ `data.records:read`
   - ✅ `data.records:write`
   - ✅ `schema.bases:read`
   - ✅ `webhook:manage`
5. Click "Create integration"
6. **Copy and save**:
   - Client ID
   - Client Secret

## Step 3: Prepare Test Data in Airtable

Create a test base in Airtable:

1. Go to https://airtable.com
2. Create a new base named "Form Builder Test"
3. Create a table named "Survey Responses"
4. Add these fields:
   - `Name` (Single line text)
   - `Email` (Single line text)
   - `Role` (Single select: Engineer, Designer, Manager)
   - `Experience` (Single line text)
   - `Skills` (Multiple select: JavaScript, Python, React, Node.js)
   - `Comments` (Long text)

## Step 4: Install Backend

```powershell
# Navigate to project
cd "c:\Users\venka\OneDrive\Desktop\BustBrain Task"

# Go to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env
```

Edit `backend\.env`:

```env
MONGODB_URI=mongodb://localhost:27017/airtable-form-builder
PORT=5000
NODE_ENV=development
AIRTABLE_CLIENT_ID=your_client_id_here
AIRTABLE_CLIENT_SECRET=your_client_secret_here
AIRTABLE_REDIRECT_URI=http://localhost:5000/auth/airtable/callback
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=your_random_secret_at_least_32_characters_long
AIRTABLE_WEBHOOK_SECRET=webhook_secret_for_testing
```

## Step 5: Start MongoDB

### If using local MongoDB:
```powershell
# Start MongoDB
mongod
```

### If using MongoDB Atlas:
1. Go to https://cloud.mongodb.com
2. Create a free cluster
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for development)
5. Get connection string and update `MONGODB_URI` in `.env`

## Step 6: Start Backend Server

```powershell
# In backend directory
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB connected successfully
```

## Step 7: Install Frontend

Open a new terminal:

```powershell
# Navigate to frontend
cd "c:\Users\venka\OneDrive\Desktop\BustBrain Task\frontend"

# Install dependencies
npm install

# Create .env file
copy .env.example .env
```

Edit `frontend\.env`:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

## Step 8: Start Frontend

```powershell
# In frontend directory
npm start
```

Browser should open at http://localhost:3000

## Step 9: Test the Application

### Test 1: OAuth Authentication

1. Click "Login with Airtable"
2. You'll be redirected to Airtable
3. Click "Add base" to grant access to your test base
4. Click "Grant access"
5. You should be redirected to the dashboard

✅ **Success**: You're logged in and see the dashboard

### Test 2: Create a Form

1. Click "Create New Form"
2. Enter form title: "Test Survey"
3. Select your test base
4. Select "Survey Responses" table
5. Check these fields:
   - Name
   - Role
   - Experience
   - Skills
6. Click on "Name" question:
   - Mark as "Required"
7. Click on "Experience" question:
   - Click "Add Condition"
   - Select: Role equals Engineer
   - This will show Experience only for Engineers

8. Click "Create Form"

✅ **Success**: Form is created and you return to dashboard

### Test 3: Fill Out the Form

1. From dashboard, click "View" on your form
2. Fill out the form:
   - Name: "John Doe"
   - Role: "Manager" (notice Experience is hidden)
   - Skills: Check "JavaScript" and "React"
3. Try to submit (should fail - Name is required)
4. Change Role to "Engineer"
   - Notice Experience field appears!
5. Fill Experience: "5 years"
6. Click "Submit Form"

✅ **Success**: Form submitted successfully

### Test 4: Verify Data Storage

**Check Airtable:**
1. Go to your Airtable base
2. Open "Survey Responses" table
3. You should see the new record with your data

**Check MongoDB:**
```powershell
# Open MongoDB shell
mongosh

# Switch to database
use airtable-form-builder

# Check responses
db.responses.find().pretty()
```

✅ **Success**: Record exists in both Airtable and MongoDB

### Test 5: View Responses

1. From dashboard, click "Responses" on your form
2. You should see your submission with:
   - Submission ID
   - Airtable Record ID
   - Timestamp
   - Status: Active
   - Answer preview

✅ **Success**: Response is displayed correctly

### Test 6: Export Responses

1. On the responses page, click "Export as JSON"
2. File should download
3. Click "Export as CSV"
4. File should download

✅ **Success**: Both exports work

### Test 7: Test Webhook Sync (Optional)

**Setup webhook manually:**

```bash
curl -X POST https://api.airtable.com/v0/bases/YOUR_BASE_ID/webhooks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notificationUrl": "http://localhost:5000/webhooks/airtable",
    "specification": {
      "options": {
        "filters": {
          "dataTypes": ["tableData"]
        }
      }
    }
  }'
```

**Note**: For local testing, you'll need to use a tool like ngrok to expose your local server.

**Test webhook:**
1. Edit the record in Airtable (change Name to "Jane Doe")
2. Check MongoDB - the record should update
3. Delete the record in Airtable
4. Check responses page - status should show "Deleted in Airtable"

✅ **Success**: Webhooks are syncing

## Common Issues & Solutions

### Issue: MongoDB Connection Error

**Error**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution**:
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- If using Atlas, verify IP whitelist

### Issue: OAuth Redirect Mismatch

**Error**: "redirect_uri_mismatch"

**Solution**:
- Verify `AIRTABLE_REDIRECT_URI` in `.env` matches Airtable OAuth settings exactly
- Check for trailing slashes
- Ensure port number is correct (5000)

### Issue: CORS Error

**Error**: "Access to fetch has been blocked by CORS policy"

**Solution**:
- Verify backend is running on port 5000
- Check `FRONTEND_URL` in backend `.env` is `http://localhost:3000`
- Restart both servers

### Issue: Session Not Persisting

**Error**: User logged out after refresh

**Solution**:
- Ensure `SESSION_SECRET` is set in backend `.env`
- Check browser allows cookies
- Clear browser cache and cookies
- Restart backend server

### Issue: Cannot Find Module

**Error**: `Cannot find module 'express'`

**Solution**:
```powershell
# Reinstall dependencies
cd backend
rm -rf node_modules
npm install

cd ../frontend
rm -rf node_modules
npm install
```

## Verification Checklist

After completing all tests, verify:

- [ ] Can log in with Airtable OAuth
- [ ] Can see list of Airtable bases
- [ ] Can create form with multiple fields
- [ ] Can configure required fields
- [ ] Can add conditional logic
- [ ] Conditional logic works in real-time
- [ ] Form validates before submission
- [ ] Response saves to both Airtable and MongoDB
- [ ] Can view all responses
- [ ] Can export responses (JSON/CSV)
- [ ] No console errors
- [ ] Token refresh works (wait 1 hour and test)

## Performance Testing

Test with multiple forms and responses:

```javascript
// Create 10 test responses
for (let i = 0; i < 10; i++) {
  // Fill and submit form
}
```

Verify:
- Dashboard loads quickly
- Response listing handles multiple records
- Export works with larger datasets

## Security Testing

Test these scenarios:

1. **Unauthorized Access**:
   - Try accessing `/dashboard` without logging in
   - Should redirect to login

2. **Token Expiration**:
   - Wait for token to expire
   - Make an API call
   - Should auto-refresh token

3. **Invalid Form ID**:
   - Access `/form/invalid-id`
   - Should show "Form not found"

## Next Steps

Once all tests pass:

1. Review code for any hardcoded values
2. Test edge cases (empty forms, long text, special characters)
3. Review console for warnings
4. Check network tab for failed requests
5. Test on different browsers
6. Prepare for deployment

## Getting Help

If you encounter issues:

1. Check the console for errors (F12 in browser)
2. Review backend logs in terminal
3. Verify all environment variables are set
4. Check MongoDB connection
5. Ensure Airtable OAuth credentials are correct
6. Review README.md troubleshooting section

## Success!

If all tests pass, your application is working correctly and ready for deployment!

Proceed to DEPLOYMENT.md for production deployment instructions.
