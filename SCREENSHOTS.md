# Project Screenshots & Demo Guide

## Application Flow Screenshots

### 1. Login Page
**URL**: `http://localhost:3000/login`

**What to see**:
- Clean, centered login card
- "Login with Airtable" button
- Welcome message
- Error messages (if OAuth fails)

**Screenshot checklist**:
- [ ] Full page view
- [ ] Button hover state

---

### 2. Dashboard
**URL**: `http://localhost:3000/dashboard`

**What to see**:
- Navigation bar with user name and logout button
- "Create New Form" button (prominent)
- Table listing all created forms with:
  - Form title
  - Connected Airtable table
  - Number of questions
  - Created date
  - Action buttons (View, Responses, Delete)
- Empty state if no forms exist

**Screenshot checklist**:
- [ ] Dashboard with no forms (empty state)
- [ ] Dashboard with 2-3 forms
- [ ] Hover states on action buttons

---

### 3. Form Builder - Step 1: Form Details
**URL**: `http://localhost:3000/forms/new`

**What to see**:
- Navigation with "Back to Dashboard" button
- Form title input
- Description textarea
- Base selector dropdown (populated with user's bases)
- Table selector (appears after base selection)

**Screenshot checklist**:
- [ ] Initial state
- [ ] Base dropdown expanded
- [ ] After base selected, showing tables

---

### 4. Form Builder - Step 2: Field Selection
**What to see**:
- List of available fields from selected table
- Checkboxes for each field
- Field type badges (e.g., "singleLineText", "singleSelect")
- Selected fields highlighted

**Screenshot checklist**:
- [ ] Field selection view
- [ ] Some fields checked, some unchecked
- [ ] Different field type badges visible

---

### 5. Form Builder - Step 3: Configure Questions
**What to see**:
- Question cards for each selected field
- Custom label input
- "Required field" checkbox
- "Add Condition" button
- Conditional logic configuration:
  - Question selector dropdown
  - Operator selector (equals, notEquals, contains)
  - Value input
  - Logic selector (AND/OR) when multiple conditions
  - Remove condition button

**Screenshot checklist**:
- [ ] Question card without conditions
- [ ] Question card with one condition
- [ ] Question card with multiple conditions (AND/OR logic)
- [ ] Required field checkbox checked

---

### 6. Form Viewer - Conditional Logic in Action
**URL**: `http://localhost:3000/form/:formId`

**What to see**:
- Form title and description
- Dynamic questions based on answers
- Example: "Experience" field appears only when "Role = Engineer"
- Required field indicators (red asterisk)
- Different input types:
  - Text input
  - Textarea
  - Select dropdown
  - Multiple checkboxes
  - File upload

**Screenshot checklist**:
- [ ] Form with all questions visible
- [ ] Form with conditional question hidden
- [ ] Form with conditional question visible (after condition met)
- [ ] Validation errors showing
- [ ] Success message after submission

---

### 7. Response Listing
**URL**: `http://localhost:3000/forms/:formId/responses`

**What to see**:
- Navigation bar
- Response count
- Table with columns:
  - Response ID (truncated)
  - Airtable Record ID
  - Submission timestamp
  - Status badge (Active/Deleted in Airtable)
  - Answer preview
- Export buttons (JSON, CSV)
- Empty state if no responses

**Screenshot checklist**:
- [ ] Empty state (no responses)
- [ ] Response list with 3-5 responses
- [ ] Active status badge
- [ ] Deleted status badge
- [ ] Export buttons

---

### 8. Airtable Integration Views

**What to capture**:
- Airtable OAuth authorization screen
- Airtable base showing submitted records
- Airtable table with form response data

**Screenshot checklist**:
- [ ] OAuth permission screen
- [ ] Airtable base with new records from form submissions
- [ ] Airtable record detail view

---

## Recording a Demo Video

### Video Structure (5-7 minutes)

**Minute 1: Introduction & Login**
- Show login page
- Click "Login with Airtable"
- Go through OAuth flow
- Land on dashboard

**Minute 2: Create Form**
- Click "Create New Form"
- Enter form title: "Employee Survey"
- Select Airtable base
- Select table
- Choose 5 fields

**Minute 3: Configure Questions**
- Mark "Name" as required
- Add conditional logic: Show "GitHub URL" only if "Role = Engineer"
- Set multiple conditions with AND/OR logic
- Save form

**Minute 4: Fill Out Form**
- Open form viewer
- Show conditional logic working:
  - Select "Manager" → GitHub field hidden
  - Select "Engineer" → GitHub field appears
- Try to submit without required field (show validation)
- Fill all fields and submit

**Minute 5: View Responses**
- Navigate to responses page
- Show the submitted response
- Export as JSON
- Export as CSV
- Open Airtable to show the record

**Minute 6: Webhook Demo (Optional)**
- Edit record in Airtable
- Show MongoDB updating (using Compass or shell)
- Delete record in Airtable
- Show "Deleted in Airtable" status in response list

**Minute 7: Code Walkthrough**
- Show key files:
  - `conditionalLogic.js` (explain pure function)
  - `Form.js` model (show data structure)
  - `FormViewer.js` (show real-time logic)
  - `webhooks.js` (show sync mechanism)

### Video Recording Tips

1. **Use screen recording software**:
   - Windows: Xbox Game Bar (Win + G)
   - OBS Studio (free, professional)
   - Loom (easy to use)

2. **Before recording**:
   - Close unnecessary tabs
   - Clear browser cache
   - Use incognito/private mode for clean view
   - Prepare test data in Airtable
   - Test the flow once

3. **During recording**:
   - Speak clearly and explain what you're doing
   - Don't rush - show features clearly
   - Highlight important parts (cursor or annotations)
   - Show both UI and results

4. **After recording**:
   - Add title slide with project name
   - Add text overlays for key features
   - Include timestamp markers
   - Export in HD quality (1080p)

### Alternative: Screenshot-based Documentation

If video isn't possible, create a detailed screenshot document:

1. Take screenshots of each step
2. Add annotations (arrows, highlights, text)
3. Create a presentation or PDF
4. Include captions explaining each image
5. Show before/after for conditional logic

---

## Demo Script

Use this script when recording your video:

```
[INTRO]
"Hello, I'm demonstrating the Airtable Form Builder, a full-stack MERN application 
that creates dynamic forms connected to Airtable."

[LOGIN]
"First, users authenticate using Airtable OAuth. This securely connects their 
Airtable account and grants access to their bases."

[DASHBOARD]
"After login, users see their dashboard with all created forms. Let's create a new one."

[FORM BUILDER]
"The form builder lets users select an Airtable base and table. I'm choosing my 
'Employee Survey' table. Now I can see all available fields and select which ones 
to include in the form."

[CONFIGURATION]
"Here I can customize each question. I'm marking Name as required. Now, let me add 
conditional logic. I want the GitHub URL field to only show for Engineers."

[CONDITIONAL LOGIC]
"I'm adding a condition: show this field when Role equals Engineer. I can also add 
multiple conditions with AND or OR logic for more complex scenarios."

[FORM VIEWER]
"Now let's fill out the form. Watch what happens when I change the role. When I 
select Manager, the GitHub field is hidden. But when I select Engineer, it appears. 
This is the conditional logic working in real-time."

[VALIDATION]
"If I try to submit without filling required fields, I get validation errors. 
After filling everything correctly, the form submits successfully."

[RESPONSES]
"The response is saved to both Airtable and MongoDB. Here in the responses page, 
I can see all submissions with timestamps and preview data. I can export responses 
as JSON or CSV for analysis."

[AIRTABLE]
"Let me show you the Airtable side. Here's the new record in my Airtable base 
with all the form data."

[WEBHOOKS]
"The application also supports webhooks. If I edit this record in Airtable, 
the change syncs back to the database. If I delete it, the system marks it as 
deleted rather than removing it completely."

[CODE]
"Let me quickly show the code. The conditional logic is implemented as a pure 
function that evaluates rules without side effects. It's duplicated in both 
frontend and backend for validation. The data models use MongoDB schemas with 
proper validation, and the webhook handler processes Airtable events securely."

[OUTRO]
"This application demonstrates OAuth integration, dynamic form generation, 
real-time conditional logic, dual storage, and webhook synchronization. 
Thank you for watching!"
```

---

## Screenshot Naming Convention

Save screenshots with clear names:
```
01-login-page.png
02-dashboard-empty.png
03-dashboard-with-forms.png
04-form-builder-details.png
05-form-builder-field-selection.png
06-form-builder-question-config.png
07-form-builder-conditional-logic.png
08-form-viewer-initial.png
09-form-viewer-conditional-hidden.png
10-form-viewer-conditional-visible.png
11-form-viewer-validation-error.png
12-form-viewer-success.png
13-responses-list.png
14-responses-export.png
15-airtable-oauth.png
16-airtable-records.png
```

---

## Creating a README Banner

Consider creating a simple banner image for the README:

**Elements to include**:
- Project name: "Airtable Form Builder"
- Tech stack logos: MongoDB, Express, React, Node.js, Airtable
- Tagline: "Dynamic Forms Connected to Airtable"
- Visual: Simple form illustration or screenshot collage

**Tools**:
- Canva (easy, templates available)
- Figma (professional, free tier)
- PowerPoint (simple, quick)

---

## Final Presentation Package

Organize everything in a folder:

```
Demo Materials/
├── screenshots/
│   ├── 01-login-page.png
│   ├── 02-dashboard.png
│   └── ...
├── demo-video.mp4
├── presentation.pdf
└── README-with-images.md
```

This makes it easy for reviewers to understand your project visually!
