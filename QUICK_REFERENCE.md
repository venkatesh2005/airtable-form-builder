# Quick Reference Guide

## 🚀 Quick Start Commands

```powershell
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm start
```

## 📍 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | React application |
| Backend | http://localhost:5000 | Express API |
| MongoDB | mongodb://localhost:27017 | Local database |
| Health Check | http://localhost:5000/health | Server status |

## 🔑 Environment Variables Quick Copy

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/airtable-form-builder
PORT=5000
NODE_ENV=development
AIRTABLE_CLIENT_ID=YOUR_CLIENT_ID
AIRTABLE_CLIENT_SECRET=YOUR_CLIENT_SECRET
AIRTABLE_REDIRECT_URI=http://localhost:5000/auth/airtable/callback
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=generate_random_32_char_string
AIRTABLE_WEBHOOK_SECRET=webhook_secret
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

## 📊 API Endpoints Cheat Sheet

### Authentication
```
GET  /auth/airtable                - Start OAuth flow
GET  /auth/airtable/callback      - OAuth callback
GET  /auth/me                      - Get current user
POST /auth/logout                  - Logout
```

### Airtable Integration
```
GET  /airtable/bases                              - List bases
GET  /airtable/bases/:baseId/tables              - List tables
GET  /airtable/bases/:baseId/tables/:tableId/fields - List fields
```

### Forms
```
GET    /forms          - Get all forms
GET    /forms/:id      - Get specific form
POST   /forms          - Create form
PUT    /forms/:id      - Update form
DELETE /forms/:id      - Delete form
```

### Responses
```
POST /responses              - Submit response
GET  /responses/form/:formId - Get form responses
GET  /responses/:id          - Get specific response
```

### Webhooks
```
POST /webhooks/airtable - Handle Airtable webhooks
```

## 🗃️ Database Collections

### users
```javascript
{
  _id: ObjectId,
  airtableUserId: String,
  email: String,
  name: String,
  accessToken: String,
  refreshToken: String,
  tokenExpiresAt: Date,
  createdAt: Date,
  lastLogin: Date
}
```

### forms
```javascript
{
  _id: ObjectId,
  owner: ObjectId,
  title: String,
  description: String,
  airtableBaseId: String,
  airtableTableId: String,
  airtableTableName: String,
  questions: [{
    questionKey: String,
    airtableFieldId: String,
    label: String,
    type: String,
    required: Boolean,
    options: [String],
    conditionalRules: {
      logic: String,
      conditions: [...]
    }
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### responses
```javascript
{
  _id: ObjectId,
  formId: ObjectId,
  airtableRecordId: String,
  answers: Object,
  deletedInAirtable: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎯 Supported Field Types

| Airtable Type | Internal Type | Input Control |
|---------------|---------------|---------------|
| Single line text | singleLineText | `<input type="text">` |
| Long text | multilineText | `<textarea>` |
| Single select | singleSelect | `<select>` dropdown |
| Multiple select | multipleSelects | Checkboxes |
| Attachment | multipleAttachments | `<input type="file">` |

## 🧠 Conditional Logic Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `equals` | Exact match (case-insensitive) | Role equals "Engineer" |
| `notEquals` | Not equal to | Status notEquals "Inactive" |
| `contains` | Substring/element check | Skills contains "JavaScript" |

**Logic Combinators**: `AND` (all must be true) or `OR` (any can be true)

## 🛠️ Useful MongoDB Commands

```javascript
// Connect to MongoDB
mongosh

// Use database
use airtable-form-builder

// View collections
show collections

// Find all users
db.users.find().pretty()

// Find all forms
db.forms.find().pretty()

// Find responses for a specific form
db.responses.find({ formId: ObjectId("...") }).pretty()

// Count responses
db.responses.countDocuments()

// Find deleted responses
db.responses.find({ deletedInAirtable: true })

// Delete all data (careful!)
db.dropDatabase()
```

## 🐛 Common Debugging Commands

### Check if services are running
```powershell
# Check if port 5000 is in use (backend)
netstat -ano | findstr :5000

# Check if port 3000 is in use (frontend)
netstat -ano | findstr :3000

# Check MongoDB status
mongosh --eval "db.adminCommand('ping')"
```

### View logs
```powershell
# Backend logs are in the terminal where you ran `npm run dev`
# Frontend logs are in browser console (F12)
```

### Clear cache
```powershell
# Backend
cd backend
rm -rf node_modules
npm install

# Frontend
cd frontend
rm -rf node_modules
npm install
```

## 📦 NPM Scripts

### Backend
```json
"start": "node server.js",      // Production
"dev": "nodemon server.js"      // Development with auto-reload
```

### Frontend
```json
"start": "react-scripts start",   // Development
"build": "react-scripts build",   // Production build
"test": "react-scripts test",     // Run tests
"eject": "react-scripts eject"    // Eject from CRA
```

## 🔍 Testing Checklist

Quick testing checklist for manual testing:

```
[ ] Can login with Airtable OAuth
[ ] Can see list of bases after login
[ ] Can create form with fields
[ ] Can add conditional logic
[ ] Conditional logic works in form viewer
[ ] Required field validation works
[ ] Form submits to both Airtable and MongoDB
[ ] Can view responses list
[ ] Can export responses (JSON/CSV)
[ ] Token refresh works (no logout after 1 hour)
```

## 🎨 File Structure Quick Reference

```
backend/
├── models/           # MongoDB schemas
├── routes/           # API endpoints
├── middleware/       # Auth & validation
├── utils/            # Helper functions
└── server.js         # Entry point

frontend/
├── src/
│   ├── pages/       # React components
│   ├── utils/       # Client utilities
│   └── api.js       # API client
└── public/          # Static assets
```

## 🔐 Security Checklist

```
[ ] OAuth tokens encrypted
[ ] Session secret configured
[ ] CORS properly set up
[ ] Environment variables not committed
[ ] Webhook signatures verified
[ ] Input validation on all endpoints
[ ] Error messages don't expose sensitive data
```

## 📝 Git Commands (if using version control)

```bash
# Initialize repo
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Airtable Form Builder"

# Connect to remote
git remote add origin <your-repo-url>

# Push
git push -u origin main
```

## 🚀 Deployment Quick Commands

### Backend to Render
```bash
# Using Render dashboard (recommended)
# 1. Connect GitHub repo
# 2. Set root directory: backend
# 3. Build: npm install
# 4. Start: npm start
# 5. Add environment variables
```

### Frontend to Vercel
```bash
cd frontend
vercel login
vercel
# Follow prompts
vercel --prod
```

## 💡 Pro Tips

1. **Use Postman/Insomnia** to test API endpoints
2. **MongoDB Compass** for visual database inspection
3. **React DevTools** for debugging React components
4. **Keep backend and frontend terminals visible** to see errors quickly
5. **Use incognito mode** when testing OAuth to avoid cache issues

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Main documentation |
| INSTALLATION.md | Step-by-step setup |
| DEPLOYMENT.md | Production deployment |
| ARCHITECTURE.md | Technical details |
| SUBMISSION.md | Project summary |
| SCREENSHOTS.md | Demo guide |
| CONTRIBUTING.md | Development guide |

## ⚡ Need Help?

1. Check console for errors (F12 in browser)
2. Review backend terminal logs
3. Verify environment variables
4. Check MongoDB connection
5. Confirm Airtable OAuth credentials
6. See INSTALLATION.md troubleshooting section

---

**Remember**: This is a reference guide. For detailed information, see the full documentation files!
