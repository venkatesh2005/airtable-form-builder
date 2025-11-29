# Project Submission

**Name**: Venkatesh  
**Date**: November 29, 2025  
**Task**: MERN Stack Form Builder with Airtable

## What I Built

A form builder that connects to Airtable. Users can login with their Airtable account, select a base and table, then create forms using those fields. Forms support conditional logic (show/hide fields based on answers) and responses get saved to both Airtable and MongoDB.

## Features Completed

**Required:**
1. Airtable OAuth login - works with PKCE flow
2. Form builder - select base, table, and fields from Airtable
3. Field types - text, email, number, dropdowns, textarea
4. Conditional logic - AND/OR operators with equals/notEquals/contains
5. Form viewer - public forms with real-time conditional logic
6. Dual storage - saves to Airtable and MongoDB simultaneously  
7. Response viewer - see all submissions
8. Webhooks - syncs when Airtable records change

**Extra:**
- Form validation (client + server side)
- Dashboard with full CRUD
- Export responses as CSV or JSON

## Tech Used

- Frontend: React, React Router, Axios
- Backend: Express, MongoDB, Mongoose
- Auth: Airtable OAuth 2.0
- Database: MongoDB (local dev, will use Atlas for production)

## File Structure

```
backend/
  models/         - User, Form, Response schemas
  routes/         - API endpoints
  middleware/     - auth checking, token refresh
  server.js       - main entry point

frontend/
  src/pages/      - React components (Login, Dashboard, FormBuilder, etc)
  src/api.js      - API calls
  src/App.js      - routing
```

## Setup Instructions

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# add your Airtable OAuth keys to .env
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install  
cp .env.example .env
# set REACT_APP_API_URL=http://localhost:5000
npm start
```

**Airtable OAuth Setup:**
1. Go to https://airtable.com/create/oauth
2. Create new OAuth integration
3. Add redirect URI: http://localhost:5000/auth/airtable/callback
4. Generate client secret
5. Add scopes: data.records:read, data.records:write, schema.bases:read, webhook:manage
6. Copy client ID and secret to backend .env

## How It Works

**Conditional Logic:**
The `shouldShowQuestion` function checks if a field should display based on previous answers. It evaluates conditions with AND/OR logic:
- AND = all conditions must be true
- OR = at least one condition must be true

Operators: equals, notEquals, contains (case-insensitive substring match)

**Dual Storage:**
When a form is submitted:
1. Save to Airtable first (gets record ID)
2. Save to MongoDB with Airtable record ID
3. If Airtable fails, don't save to MongoDB
4. Return success/error to user

**Webhook Sync:**
Airtable webhooks notify our backend when records change. The webhook endpoint:
1. Verifies HMAC signature
2. Updates MongoDB record if changed
3. Marks as deleted if removed from Airtable

## Testing

1. Create an Airtable base with some fields (Name, Email, Message, etc)
2. Login to the app
3. Create a form, select your base and table
4. Add a conditional field (e.g., "State" only shows if "Country" = "USA")
5. Save and view the form
6. Submit a test response
7. Check both Airtable and the Response List to verify data synced

## Deployment

See DEPLOYMENT.md for full instructions. Quick version:

1. Create MongoDB Atlas cluster
2. Deploy backend to Render
3. Deploy frontend to Vercel  
4. Update Airtable OAuth redirect URI to production URL
5. Test everything works

## Notes

- OAuth tokens auto-refresh before expiration
- Sessions stored in MongoDB (or memory if MongoDB unavailable)
- CORS configured for production
- Webhooks use HMAC-SHA256 signature verification

## Known Issues

- File upload fields show but don't actually upload (not implemented)
- Free tier hosting may sleep after inactivity
- First request after sleep will be slow

## Time Spent

About 4-5 days total:
- Day 1: OAuth, basic CRUD
- Day 2: Form builder UI, Airtable integration
- Day 3: Conditional logic, response handling  
- Day 4: Webhooks, testing, bug fixes
- Day 5: Documentation, deployment prep

## Links

- GitHub Repo: (add after pushing)
- Live Frontend: (add after deploying)
- Live Backend API: (add after deploying)

---

Let me know if you have questions about anything!
