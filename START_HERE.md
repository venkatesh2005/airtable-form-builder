# 🚀 START HERE - Complete Setup Guide

## ✅ Environment Files Configured

Your `.env` files are now properly configured with:
- ✅ Airtable OAuth credentials
- ✅ MongoDB connection string
- ✅ Secure session secret
- ✅ Webhook secret

## 📋 Next Steps to Run the Application

### Step 1: Install Backend Dependencies

```powershell
cd backend
npm install
```

This will install:
- express, mongoose, axios, dotenv, cors
- express-session, connect-mongo
- And other required packages

### Step 2: Start MongoDB

**Option A: Local MongoDB**
```powershell
# Open a new terminal and run:
mongod
```

**Option B: MongoDB Atlas (Cloud)**
If you prefer cloud database:
1. Go to https://cloud.mongodb.com
2. Create free cluster
3. Get connection string
4. Update `MONGODB_URI` in `backend\.env`

### Step 3: Start Backend Server

```powershell
# In backend folder
npm run dev
```

Expected output:
```
Server running on port 5000
MongoDB connected successfully
```

### Step 4: Install Frontend Dependencies

Open a NEW terminal:
```powershell
cd frontend
npm install
```

This will install:
- react, react-dom, react-router-dom
- axios
- react-scripts

### Step 5: Start Frontend

```powershell
# In frontend folder
npm start
```

Browser will automatically open at http://localhost:3000

## 🎯 First Time Usage

1. **Login**: Click "Login with Airtable"
2. **Authorize**: Grant access to your Airtable bases
3. **Create Form**: 
   - Click "Create New Form"
   - Select your Airtable base
   - Choose a table
   - Select fields to include
   - Configure conditional logic (optional)
   - Save form
4. **Fill Form**: Open the form viewer link
5. **View Responses**: Check the responses page

## 🔧 Quick Commands Reference

```powershell
# Backend (Terminal 1)
cd "c:\Users\venka\OneDrive\Desktop\BustBrain Task\backend"
npm install
npm run dev

# Frontend (Terminal 2)
cd "c:\Users\venka\OneDrive\Desktop\BustBrain Task\frontend"
npm install
npm start

# MongoDB (Terminal 3 - if using local)
mongod
```

## ✨ What's Already Configured

### Backend (.env)
- ✅ Airtable Client ID: `801aa715-56de-48ff-aa24-d9ae75d25d8b`
- ✅ Airtable Client Secret: Configured
- ✅ OAuth Redirect: `http://localhost:5000/auth/airtable/callback`
- ✅ MongoDB URI: `mongodb://localhost:27017/airtable-form-builder`
- ✅ Session Secret: Generated
- ✅ Webhook Secret: Configured

### Frontend (.env)
- ✅ API URL: `http://localhost:5000`
- ✅ Environment: Development

## 🐛 Troubleshooting

### If MongoDB won't start:
```powershell
# Check if MongoDB is installed
mongod --version

# If not installed, download from:
# https://www.mongodb.com/try/download/community
```

### If port 5000 is already in use:
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or change PORT in backend\.env to 5001
```

### If port 3000 is already in use:
- Frontend will ask if you want to use port 3001
- Click "Yes" or press 'Y'

## 📖 Full Documentation

See these files for more details:
- `README.md` - Complete documentation
- `INSTALLATION.md` - Detailed setup guide
- `QUICK_REFERENCE.md` - Commands cheat sheet
- `ARCHITECTURE.md` - Technical details

## ⚡ Quick Test

Once both servers are running:

1. Open http://localhost:3000
2. Click "Login with Airtable"
3. You should be redirected to Airtable OAuth
4. After authorization, you'll land on the dashboard
5. Success! 🎉

## 🎓 Your Airtable OAuth App

Your OAuth integration settings:
- **Redirect URI**: Must be exactly `http://localhost:5000/auth/airtable/callback`
- **Required Scopes**: 
  - data.records:read
  - data.records:write
  - schema.bases:read
  - webhook:manage

## 🚀 Ready to Start!

Run these commands in order:

```powershell
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: Frontend  
cd frontend
npm install
npm start

# Terminal 3: MongoDB (if local)
mongod
```

Then visit http://localhost:3000 and start building forms!

---

**Need Help?** Check `INSTALLATION.md` for detailed troubleshooting.
