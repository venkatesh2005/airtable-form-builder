# Airtable Form Builder

Dynamic forms connected to Airtable. Build forms from your Airtable bases, add conditional logic, collect responses.

## Features

- Airtable OAuth login
- Build forms using Airtable fields  
- Conditional logic (show/hide questions)
- Save responses to Airtable and MongoDB
- View responses
- Webhook sync

## Tech

React, Node.js, Express, MongoDB, Airtable API

## Setup

Backend:
```bash
cd backend
npm install
cp .env.example .env
# add your Airtable OAuth credentials to .env
npm run dev
```

Frontend:
```bash
cd frontend
npm install
npm start
```

## Deployment

Frontend: Netlify  
Backend: Render  

Set environment variables in your hosting platform matching the .env files.

## Live Demo

Frontend: https://airtable-formbuilder.netlify.app  
Backend: https://airtable-formbuilder-api.onrender.com

## How it works

1. Login with Airtable OAuth
2. Select a base and table from your Airtable account
3. Choose which fields to include in your form
4. Add conditional logic rules if needed
5. Share the form link
6. Responses get saved to both Airtable and MongoDB
7. Webhooks keep everything in sync

## Supported Field Types

- Text (short and long)
- Single select
- Multiple select  
- File attachments

## License

MIT
