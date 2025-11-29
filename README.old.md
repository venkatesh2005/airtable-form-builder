# Airtable-Connected Dynamic Form Builder

A full-stack MERN application that allows users to create dynamic forms connected to their Airtable bases, with conditional logic, real-time validation, and webhook synchronization.

## 🚀 Features

- **Airtable OAuth Authentication** - Secure login using Airtable's OAuth flow
- **Dynamic Form Builder** - Create forms by selecting fields from your Airtable tables
- **Conditional Logic** - Show/hide questions based on user responses with AND/OR logic
- **Real-time Validation** - Client and server-side validation against Airtable schema
- **Dual Storage** - Responses saved to both Airtable and MongoDB
- **Webhook Sync** - Automatic synchronization when Airtable data changes
- **Response Management** - View and export all form responses
- **Supported Field Types**: Single line text, Multi-line text, Single select, Multi-select, Attachments

## 📦 Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database and ODM
- **Axios** - HTTP client for Airtable API
- **Express Session** - Session management

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - API requests

## 🏗️ Project Structure

```
BustBrain Task/
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema with OAuth tokens
│   │   ├── Form.js              # Form definition with conditional logic
│   │   └── Response.js          # Form submissions
│   ├── routes/
│   │   ├── auth.js              # OAuth authentication endpoints
│   │   ├── airtable.js          # Airtable API proxy endpoints
│   │   ├── forms.js             # Form CRUD operations
│   │   ├── responses.js         # Response submission and retrieval
│   │   └── webhooks.js          # Airtable webhook handler
│   ├── middleware/
│   │   └── auth.js              # Authentication middleware
│   ├── utils/
│   │   └── conditionalLogic.js  # Pure functions for conditional logic
│   ├── server.js                # Express server setup
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.js         # OAuth login page
    │   │   ├── Dashboard.js     # Form listing and management
    │   │   ├── FormBuilder.js   # Create and configure forms
    │   │   ├── FormViewer.js    # Fill out forms with conditional logic
    │   │   └── ResponseList.js  # View all responses
    │   ├── utils/
    │   │   └── conditionalLogic.js  # Client-side conditional logic
    │   ├── App.js               # Main app component with routing
    │   ├── api.js               # API client setup
    │   └── index.css            # Global styles
    ├── public/
    │   └── index.html
    ├── package.json
    └── .env.example
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Airtable account with OAuth app configured

### 1. Clone the Repository
```bash
cd "c:\Users\venka\OneDrive\Desktop\BustBrain Task"
```

### 2. Airtable OAuth Setup

1. Go to [Airtable Create OAuth Integration](https://airtable.com/create/oauth)
2. Create a new OAuth integration:
   - **Name**: Your app name
   - **Redirect URL**: `http://localhost:5000/auth/airtable/callback` (development)
   - **Scopes**: 
     - `data.records:read`
     - `data.records:write`
     - `schema.bases:read`
     - `webhook:manage`
3. Save your **Client ID** and **Client Secret**

### 3. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/airtable-form-builder

# Server Configuration
PORT=5000
NODE_ENV=development

# Airtable OAuth Configuration
AIRTABLE_CLIENT_ID=your_actual_client_id
AIRTABLE_CLIENT_SECRET=your_actual_client_secret
AIRTABLE_REDIRECT_URI=http://localhost:5000/auth/airtable/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Session Secret (generate a random string)
SESSION_SECRET=your_random_secret_key_at_least_32_chars

# Airtable Webhook Configuration
AIRTABLE_WEBHOOK_SECRET=your_webhook_secret
```

Start MongoDB (if running locally):
```bash
mongod
```

Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

Start the frontend:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 📊 Data Models

### User Model
```javascript
{
  airtableUserId: String,     // Unique Airtable user ID
  email: String,              // User email
  name: String,               // User name
  accessToken: String,        // OAuth access token
  refreshToken: String,       // OAuth refresh token
  tokenExpiresAt: Date,       // Token expiration
  createdAt: Date,
  lastLogin: Date
}
```

### Form Model
```javascript
{
  owner: ObjectId,            // Reference to User
  title: String,              // Form title
  description: String,        // Form description
  airtableBaseId: String,     // Airtable base ID
  airtableTableId: String,    // Airtable table ID
  airtableTableName: String,  // Table name for display
  questions: [{
    questionKey: String,      // Internal identifier
    airtableFieldId: String,  // Airtable field ID
    label: String,            // Display label
    type: String,             // Field type (singleLineText, etc.)
    required: Boolean,        // Is field required
    options: [String],        // Options for select fields
    conditionalRules: {       // Visibility rules
      logic: String,          // AND or OR
      conditions: [{
        questionKey: String,  // Which question to check
        operator: String,     // equals, notEquals, contains
        value: Any            // Value to compare
      }]
    }
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Response Model
```javascript
{
  formId: ObjectId,           // Reference to Form
  airtableRecordId: String,   // Airtable record ID
  answers: Object,            // Question key -> answer value map
  deletedInAirtable: Boolean, // Sync flag from webhook
  createdAt: Date,
  updatedAt: Date
}
```

## 🧠 Conditional Logic Explanation

The conditional logic system allows form questions to be shown or hidden based on previous answers.

### How It Works

Each question can have `conditionalRules` that determine its visibility:

```javascript
{
  logic: "AND" | "OR",  // How to combine conditions
  conditions: [
    {
      questionKey: "role",       // Question to check
      operator: "equals",        // Comparison operator
      value: "Engineer"          // Expected value
    }
  ]
}
```

### Operators

- **equals**: Exact match (case-insensitive)
  - Single values: `"Engineer" equals "engineer"` → true
  - Arrays: Checks if array contains the value
  
- **notEquals**: Inverse of equals
  
- **contains**: Substring/element check
  - Strings: `"Software Engineer" contains "Engineer"` → true
  - Arrays: Checks if any element contains the substring

### Logic Operators

- **AND**: All conditions must be true
- **OR**: At least one condition must be true

### Example Scenarios

**Show GitHub URL only for Engineers:**
```javascript
{
  logic: "AND",
  conditions: [
    { questionKey: "role", operator: "equals", value: "Engineer" }
  ]
}
```

**Show experience field for Engineers or Designers:**
```javascript
{
  logic: "OR",
  conditions: [
    { questionKey: "role", operator: "equals", value: "Engineer" },
    { questionKey: "role", operator: "equals", value: "Designer" }
  ]
}
```

**Show portfolio only if role is Designer AND has 2+ years experience:**
```javascript
{
  logic: "AND",
  conditions: [
    { questionKey: "role", operator: "equals", value: "Designer" },
    { questionKey: "experience", operator: "contains", value: "2" }
  ]
}
```

### Implementation

The logic is implemented as a pure function `shouldShowQuestion(rules, answers)` that:
1. Returns `true` if no rules exist
2. Evaluates each condition against current answers
3. Combines results using AND/OR logic
4. Handles missing values gracefully (returns `false`)

This function is duplicated in both backend (`utils/conditionalLogic.js`) and frontend (`src/utils/conditionalLogic.js`) for validation and real-time UI updates.

## 🔗 Webhook Configuration

Airtable webhooks keep your MongoDB database synchronized with changes in Airtable.

### Setting Up Webhooks

1. Create a webhook in Airtable:
```bash
curl -X POST https://api.airtable.com/v0/bases/{baseId}/webhooks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notificationUrl": "https://your-deployed-backend.com/webhooks/airtable",
    "specification": {
      "options": {
        "filters": {
          "dataTypes": ["tableData"]
        }
      }
    }
  }'
```

2. The webhook endpoint (`POST /webhooks/airtable`) handles:
   - **Record created**: Logged (optional: create in DB)
   - **Record updated**: Updates corresponding MongoDB response
   - **Record deleted**: Sets `deletedInAirtable: true` flag

### Webhook Security

The endpoint verifies webhook signatures using HMAC-SHA256:
```javascript
const signature = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(`${timestamp}.${payload}`)
  .digest('base64');
```

## 🚀 Deployment

### Backend Deployment (Render/Railway)

#### Using Render:
1. Connect your GitHub repository
2. Create a new Web Service
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables from `.env`
6. Deploy

#### Using Railway:
1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Add environment variables: `railway variables set KEY=value`
5. Deploy: `railway up`

### Frontend Deployment (Vercel/Netlify)

#### Using Vercel:
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to frontend: `cd frontend`
3. Deploy: `vercel`
4. Set environment variable: `REACT_APP_API_URL=your_backend_url`
5. Deploy to production: `vercel --prod`

#### Using Netlify:
1. Build the app: `npm run build`
2. Install Netlify CLI: `npm i -g netlify-cli`
3. Deploy: `netlify deploy --prod --dir=build`
4. Set environment variables in Netlify dashboard

### Production Environment Variables

**Backend:**
- Update `MONGODB_URI` to MongoDB Atlas connection string
- Update `AIRTABLE_REDIRECT_URI` to production callback URL
- Update `FRONTEND_URL` to production frontend URL
- Set `NODE_ENV=production`
- Generate strong `SESSION_SECRET`

**Frontend:**
- Update `REACT_APP_API_URL` to production backend URL

## 📝 API Endpoints

### Authentication
- `GET /auth/airtable` - Initiate OAuth flow
- `GET /auth/airtable/callback` - OAuth callback
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout user

### Airtable
- `GET /airtable/bases` - Get user's Airtable bases
- `GET /airtable/bases/:baseId/tables` - Get tables in a base
- `GET /airtable/bases/:baseId/tables/:tableId/fields` - Get fields in a table

### Forms
- `GET /forms` - Get all forms for user
- `GET /forms/:formId` - Get specific form
- `POST /forms` - Create new form
- `PUT /forms/:formId` - Update form
- `DELETE /forms/:formId` - Delete form

### Responses
- `POST /responses` - Submit form response
- `GET /responses/form/:formId` - Get all responses for a form
- `GET /responses/:responseId` - Get specific response

### Webhooks
- `POST /webhooks/airtable` - Handle Airtable webhook events

## 🎯 Usage Flow

1. **Login**: User authenticates via Airtable OAuth
2. **Create Form**: 
   - Select Airtable base and table
   - Choose fields to include
   - Configure labels and required status
   - Add conditional logic rules
3. **Share Form**: Send form URL to respondents
4. **Fill Form**: Users complete form with real-time conditional logic
5. **Submit**: Response saved to both Airtable and MongoDB
6. **View Responses**: Access response dashboard with export options
7. **Stay Synced**: Webhooks keep data synchronized

## 🧪 Testing the Application

### Manual Testing Steps

1. **OAuth Flow**:
   - Navigate to login page
   - Click "Login with Airtable"
   - Authorize the application
   - Verify redirect to dashboard

2. **Form Creation**:
   - Create a test base in Airtable with sample fields
   - Select base and table in form builder
   - Add at least 3 fields
   - Set one field as required
   - Add conditional logic to one field
   - Save form

3. **Form Submission**:
   - Open form viewer
   - Test conditional logic by changing answers
   - Try submitting with missing required fields
   - Submit valid response
   - Check Airtable for new record
   - Check MongoDB for saved response

4. **Webhook Testing**:
   - Update a record in Airtable
   - Check MongoDB for updated response
   - Delete a record in Airtable
   - Verify `deletedInAirtable` flag is set

## 🔒 Security Considerations

- OAuth tokens stored encrypted in database
- Session-based authentication with HTTP-only cookies
- CORS configured for specific frontend origin
- Webhook signature verification
- Input validation on all endpoints
- SQL injection prevention via Mongoose
- XSS protection via React's built-in sanitization

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify network access if using MongoDB Atlas

### OAuth Redirect Mismatch
- Verify `AIRTABLE_REDIRECT_URI` matches Airtable OAuth settings
- Check for http vs https mismatch
- Ensure no trailing slashes

### CORS Errors
- Verify `FRONTEND_URL` in backend `.env`
- Check `REACT_APP_API_URL` in frontend `.env`
- Ensure `withCredentials: true` in API calls

### Webhook Not Working
- Verify webhook URL is publicly accessible
- Check webhook secret configuration
- Review webhook logs in Airtable dashboard

## 📄 License

MIT

## 👤 Author

Created as part of the BustBrain interview assignment

## 🙏 Acknowledgments

- Airtable API Documentation
- MERN Stack Community
- React Router Documentation
