# Airtable Form Builder - Architecture Overview

## System Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   React     │────────▶│  Express    │────────▶│  MongoDB    │
│  Frontend   │         │  Backend    │         │  Database   │
└─────────────┘         └─────────────┘         └─────────────┘
                               │
                               │
                        ┌──────▼──────┐
                        │  Airtable   │
                        │     API     │
                        └──────▲──────┘
                               │
                        ┌──────┴──────┐
                        │  Webhooks   │
                        └─────────────┘
```

## Data Flow

### 1. Authentication Flow
```
User → Login Button → OAuth Redirect → Airtable Auth → Callback → 
Token Storage → Session Creation → Dashboard Redirect
```

### 2. Form Creation Flow
```
User → Select Base → Select Table → Fetch Fields → Configure Questions → 
Add Conditional Logic → Save Form Definition → MongoDB Storage
```

### 3. Form Submission Flow
```
User → Fill Form → Conditional Logic Evaluation → Client Validation → 
Submit → Server Validation → Save to Airtable → Save to MongoDB → 
Success Response
```

### 4. Webhook Sync Flow
```
Airtable Change → Webhook Event → Signature Verification → 
Event Processing → MongoDB Update → Sync Complete
```

## Key Design Decisions

### 1. Conditional Logic Implementation
- **Pure functions**: `shouldShowQuestion()` works without side effects
- **Duplicated code**: Same logic in frontend and backend for validation
- **Flexible operators**: Supports equals, notEquals, contains
- **Logic combinators**: AND/OR for multiple conditions

### 2. Data Storage Strategy
- **Dual storage**: Both Airtable (source of truth) and MongoDB (fast queries)
- **Soft deletes**: `deletedInAirtable` flag instead of hard delete
- **Rich metadata**: Store form configuration separate from responses

### 3. Security Approach
- **OAuth tokens**: Encrypted storage, automatic refresh
- **Session-based auth**: HTTP-only cookies prevent XSS
- **Webhook signatures**: HMAC-SHA256 verification
- **Input validation**: Both client and server side

### 4. API Design
- **RESTful routes**: Standard HTTP methods and status codes
- **Middleware chain**: auth → token validation → route handler
- **Error formatting**: Consistent error response structure
- **CORS configuration**: Specific origin, credentials enabled

## Component Structure

### Backend Components

```
server.js
├── routes/
│   ├── auth.js          (OAuth flow)
│   ├── airtable.js      (Airtable API proxy)
│   ├── forms.js         (Form CRUD)
│   ├── responses.js     (Response handling)
│   └── webhooks.js      (Webhook processing)
├── models/
│   ├── User.js          (User schema)
│   ├── Form.js          (Form schema)
│   └── Response.js      (Response schema)
├── middleware/
│   ├── auth.js          (Session check)
│   └── tokenValidator.js (Token refresh)
└── utils/
    ├── conditionalLogic.js (Logic evaluation)
    ├── tokenManager.js     (Token operations)
    └── airtableHelpers.js  (Airtable utilities)
```

### Frontend Components

```
App.js
├── pages/
│   ├── Login.js         (OAuth initiation)
│   ├── Dashboard.js     (Form management)
│   ├── FormBuilder.js   (Form creation)
│   ├── FormViewer.js    (Form filling)
│   └── ResponseList.js  (Response display)
├── utils/
│   ├── conditionalLogic.js (Client-side logic)
│   └── helpers.js          (Utility functions)
├── context/
│   └── AuthContext.js      (Auth state)
└── api.js                  (API client)
```

## Database Schema Design

### User Collection
- Stores OAuth credentials securely
- Tracks token expiration
- Links to owned forms

### Form Collection
- References user (owner)
- Stores Airtable connection info
- Contains question definitions with logic
- Embedded document pattern for questions

### Response Collection
- References form
- Links to Airtable record
- Stores complete answer set
- Tracks sync status

## Performance Considerations

1. **Minimal API calls**: Cache Airtable schema data
2. **Efficient queries**: Index on formId, userId, airtableRecordId
3. **Token management**: Proactive refresh before expiration
4. **Webhook processing**: Async handling, non-blocking
5. **Frontend optimization**: Conditional rendering, lazy loading

## Scalability Path

1. **Database**: MongoDB sharding for large datasets
2. **Caching**: Redis for session and schema caching
3. **File storage**: S3 for attachment handling
4. **Queue system**: Bull/RabbitMQ for webhook processing
5. **Load balancing**: Multiple backend instances
6. **CDN**: Static asset delivery

## Testing Strategy

### Manual Testing Focus
- OAuth flow end-to-end
- Form creation with all field types
- Conditional logic with various combinations
- Form submission validation
- Webhook synchronization
- Error scenarios

### Key Test Cases
1. Create form with 5+ fields
2. Add conditional logic (AND/OR)
3. Submit valid/invalid responses
4. Update Airtable record externally
5. Delete Airtable record
6. Token expiration handling

## Future Enhancements

- [ ] Form templates
- [ ] Advanced field types (date, number, formula)
- [ ] Multi-page forms
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Collaborative editing
- [ ] Form versioning
- [ ] API rate limiting
- [ ] Comprehensive test suite
- [ ] Admin panel

## Maintenance Notes

- Check Airtable API version compatibility quarterly
- Monitor webhook delivery rates
- Review and rotate OAuth secrets annually
- Update dependencies monthly
- Backup MongoDB data weekly
