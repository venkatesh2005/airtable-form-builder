# Airtable Form Builder

Build dynamic forms connected to your Airtable bases with conditional logic and real-time syncing.

## Features

### Core
- Airtable OAuth login
- Form builder with Airtable field selection
- Multiple field types (text, email, number, dropdown, textarea)
- Conditional logic (show/hide fields based on answers)
- Public form viewer
- Dual storage (Airtable + MongoDB)
- Response viewer
- Webhook sync

### Additional
- Form validation
- Dashboard with CRUD
- CSV/JSON export

## Tech Stack

Frontend: React 18, React Router, Axios  
Backend: Node.js, Express, MongoDB, Mongoose  
Auth: Airtable OAuth 2.0 with PKCE  
Deployment: Vercel/Netlify (frontend), Render/Railway (backend)

## Prerequisites

- Node.js 14+
- MongoDB
- Airtable account
- Git

## Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd "BustBrain Task"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
MONGODB_URI=mongodb://localhost:27017/airtable-form-builder
PORT=5000
NODE_ENV=development

AIRTABLE_CLIENT_ID=your_client_id
AIRTABLE_CLIENT_SECRET=your_client_secret
AIRTABLE_REDIRECT_URI=http://localhost:5000/auth/airtable/callback

FRONTEND_URL=http://localhost:3000
SESSION_SECRET=generate_with_crypto
AIRTABLE_WEBHOOK_SECRET=generate_with_crypto
```

Generate secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

Start frontend:
```bash
npm start
```

Visit: http://localhost:3000

## 🔐 Airtable OAuth Setup

### Step 1: Create OAuth Integration

1. Go to https://airtable.com/create/oauth
2. Click **"Register new OAuth integration"**
3. Fill in details:
   - **Name**: Airtable Form Builder
   - **Description**: Dynamic form builder with conditional logic
   - **Redirect URL**: `http://localhost:5000/auth/airtable/callback`
4. Select scopes:
   - `data.records:read`
   - `data.records:write`
   - `schema.bases:read`
   - `webhook:manage`

### Step 2: Generate Client Secret

1. In your OAuth integration settings
2. Click **"Generate client secret"**
3. Copy the **Client ID** and **Client Secret**
4. Add them to your backend `.env` file

### Step 3: Update Redirect URI for Production

When deploying:
1. Go back to OAuth integration settings
2. Add production redirect URI: `https://your-backend-url.com/auth/airtable/callback`

## 📊 Data Models

### User Schema (MongoDB)
```javascript
{
  airtableUserId: String,      // Unique Airtable user ID
  email: String,               // User email
  name: String,                // User display name
  accessToken: String,         // Encrypted OAuth token
  refreshToken: String,        // Token for renewal
  tokenExpiresAt: Date,        // Token expiration
  lastLogin: Date,             // Last login timestamp
  createdAt: Date              // Account creation date
}
```

### Form Schema (MongoDB)
```javascript
{
  userId: ObjectId,            // Creator reference
  title: String,               // Form title
  description: String,         // Form description
  airtableBaseId: String,      // Connected Airtable base
  airtableTableId: String,     // Connected Airtable table
  airtableTableName: String,   // Table name for API calls
  questions: [
    {
      questionKey: String,     // Unique identifier
      airtableFieldId: String, // Airtable field ID
      label: String,           // Display label
      type: String,            // Field type
      required: Boolean,       // Validation flag
      options: [String],       // For dropdowns
      conditionalLogic: {
        enabled: Boolean,
        operator: String,      // 'AND' or 'OR'
        conditions: [
          {
            questionKey: String,
            operator: String,  // 'equals', 'notEquals', 'contains'
            value: String
          }
        ]
      }
    }
  ],
  isActive: Boolean,           // Form status
  createdAt: Date,
  updatedAt: Date
}
```

### Response Schema (MongoDB)
```javascript
{
  formId: ObjectId,            // Form reference
  airtableRecordId: String,    // Airtable record ID
  answers: {
    [questionKey]: Mixed       // Key-value pairs of answers
  },
  submittedAt: Date,           // Submission timestamp
  syncedWithAirtable: Boolean, // Sync status
  deleted: Boolean             // Soft delete flag
}
```

## 🔀 Conditional Logic System

### Logic Structure

Forms support conditional display of questions based on previous answers:

```javascript
conditionalLogic: {
  enabled: true,
  operator: 'AND',  // 'AND' or 'OR'
  conditions: [
    {
      questionKey: 'country',
      operator: 'equals',
      value: 'USA'
    },
    {
      questionKey: 'age',
      operator: 'contains',
      value: '18'
    }
  ]
}
```

### Supported Operators

- **equals**: Exact match
- **notEquals**: Not equal to
- **contains**: Contains substring (case-insensitive)

### Evaluation Logic

The `shouldShowQuestion` function evaluates conditions:

```javascript
// AND operator: ALL conditions must be true
if (operator === 'AND') {
  return conditions.every(condition => evaluateCondition(condition, answers));
}

// OR operator: AT LEAST ONE condition must be true
if (operator === 'OR') {
  return conditions.some(condition => evaluateCondition(condition, answers));
}
```

### Example Use Case

**Survey Question Flow:**
1. "What is your country?" → Text input
2. "What is your state?" → Only shown if country = "USA"
3. "Do you need a visa?" → Only shown if country ≠ "USA"

## 🔔 Webhook Configuration

### Setting Up Webhooks

1. **Create Webhook Endpoint** (automated in code):
   ```javascript
   POST https://api.airtable.com/v0/bases/{baseId}/webhooks
   ```

2. **Configure Notification URL**:
   ```
   https://your-backend-url.com/webhooks/airtable
   ```

3. **Add Webhook Secret** to `.env`:
   ```env
   AIRTABLE_WEBHOOK_SECRET=your_random_secret
   ```

### Webhook Flow

1. Airtable record updated/deleted
2. Webhook triggers backend endpoint
3. Signature verified using HMAC-SHA256
4. MongoDB record updated/soft-deleted
5. Response synced across both systems

### Security

- **HMAC-SHA256 signature verification**
- **Secret key validation**
- **Request timestamp checking**

## 🗂️ Project Structure

```
BustBrain-Task/
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Form.js              # Form schema
│   │   └── Response.js          # Response schema
│   ├── routes/
│   │   ├── auth.js              # OAuth endpoints
│   │   ├── airtable.js          # Airtable API proxy
│   │   ├── forms.js             # Form CRUD
│   │   ├── responses.js         # Response management
│   │   └── webhooks.js          # Webhook handlers
│   ├── middleware/
│   │   ├── auth.js              # Authentication check
│   │   └── tokenValidator.js   # Token refresh
│   ├── utils/
│   │   └── conditionalLogic.js # Logic evaluation
│   ├── .env.example             # Environment template
│   ├── server.js                # Express server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js         # OAuth login
│   │   │   ├── Dashboard.js     # Form list
│   │   │   ├── FormBuilder.js   # Create/edit forms
│   │   │   ├── FormViewer.js    # Public form view
│   │   │   └── ResponseList.js  # View submissions
│   │   ├── api.js               # Axios configuration
│   │   ├── App.js               # Router setup
│   │   └── index.css            # Global styles
│   ├── .env.example             # Environment template
│   └── package.json
│
├── README.md                    # This file
└── DEPLOYMENT.md                # Deployment guide
```

## 🧪 Testing the Application

### 1. Create an Airtable Base

1. Go to https://airtable.com
2. Create a new base: "Contact Forms"
3. Add a table: "Submissions"
4. Add fields:
   - Name (Single line text)
   - Email (Email)
   - Phone (Phone number)
   - Message (Long text)

### 2. Test OAuth Flow

1. Visit http://localhost:3000
2. Click "Login with Airtable"
3. Authorize the application
4. Verify redirect to dashboard

### 3. Create a Form

1. Click "Create New Form"
2. Enter form title: "Contact Us"
3. Select your Airtable base
4. Select the "Submissions" table
5. Choose fields to include
6. Add conditional logic (optional)
7. Save form

### 4. Submit a Response

1. Click "View Form" on dashboard
2. Fill out the form
3. Submit
4. Verify data in:
   - Airtable base (check your table)
   - Response list in dashboard

### 5. Test Conditional Logic

1. Edit your form
2. Add a question: "Country"
3. Add a question: "State" with condition:
   - Show if Country equals "USA"
4. Test form submission with different countries

## 📦 Deployment Guide

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:
- Frontend: Vercel / Netlify
- Backend: Render / Railway
- Database: MongoDB Atlas

Quick deployment checklist:
- [ ] Create MongoDB Atlas cluster
- [ ] Update Airtable OAuth redirect URI
- [ ] Deploy backend to Render/Railway
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Update environment variables
- [ ] Test OAuth flow on production

## 🐛 Troubleshooting

### OAuth Errors

**Error: "Invalid client credentials"**
- Solution: Verify client secret is generated and correct in `.env`

**Error: "Redirect URI mismatch"**
- Solution: Check OAuth integration redirect URI matches exactly

### MongoDB Connection Issues

**Error: "MongoDB connection failed"**
- Solution: Check MongoDB is running locally or Atlas connection string is correct

### CORS Errors

**Error: "CORS policy blocked"**
- Solution: Verify `FRONTEND_URL` in backend `.env` matches your frontend URL

### Form Submission Issues

**Error: "Failed to create Airtable record"**
- Solution: Check OAuth scopes include `data.records:write`

## 📝 Environment Variables Reference

### Backend

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/db` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `AIRTABLE_CLIENT_ID` | OAuth client ID | From Airtable |
| `AIRTABLE_CLIENT_SECRET` | OAuth client secret | From Airtable |
| `AIRTABLE_REDIRECT_URI` | OAuth callback URL | `http://localhost:5000/auth/airtable/callback` |
| `FRONTEND_URL` | Frontend origin | `http://localhost:3000` |
| `SESSION_SECRET` | Session encryption key | Random 64-char string |
| `AIRTABLE_WEBHOOK_SECRET` | Webhook signature key | Random string |

### Frontend

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5000` |

## 🤝 Contributing

This is an interview assignment project. For suggestions or improvements, please reach out.

## 📄 License

This project is created for BustBrain interview assessment.

## 👤 Author

Venkatesh - BustBrain Interview Assignment
Submission Date: November 29, 2025

## 🙏 Acknowledgments

- Airtable for OAuth and API documentation
- BustBrain for the opportunity
- React and Express.js communities

---

**Note**: This application is built for educational and assessment purposes as part of the BustBrain interview process.
