# MERN Airtable-Connected Dynamic Form Builder

A full-stack MERN application that integrates Airtable OAuth, dynamic form builder, conditional logic, and bidirectional syncing with Airtable records.

---

# 🚀 Features

### ✅ Airtable OAuth Login

Secure PKCE-based OAuth authentication with Airtable.

### ✅ Form Builder

- Select Airtable Base → Table → Fields
- Choose supported field types
- Add required fields
- Add conditional rules
- Save complete form schema to MongoDB

### ✅ Form Viewer

- Render fields dynamically
- Apply conditional visibility rules in real time
- Submit responses
- Validate required fields, selects, multiselects
- Upload files (attachment fields)

### ✅ Save Responses

- Save a new row in Airtable
- Save same response in MongoDB
- Responses dashboard

### ✅ Webhook Sync

Airtable → Backend webhooks update local DB

- On update → update local record
- On delete → mark as deletedInAirtable

---

# Airtable OAuth Setup Guide

### 1. Go to Airtable Developers Dashboard

https://airtable.com/create/oauth

### 2. Create OAuth App

Add:

Authorized Redirect URI:
https://your-frontend.com/oauth/callback

Client ID

Client Secret

### 3. Enable Scopes:

schema.bases:read
data.records:read
data.records:write

### 4. PKCE Flow

The backend:

Generates code_verifier

Generates code_challenge

Stores PKCE verifier in Mongo

Redirects user to Airtable

Frontend receives code and state

Frontend sends both to backend

Backend exchanges code → tokens

Backend saves user + returns JWT cookie

# Data Models Explanation

### User Model

```bash
airtableUserId: String
email: String
name: String
accessToken: String
refreshToken: String
```

### Form model

```bash
title: String
owner: ObjectId (User)
baseId: String
tableId: String
questions: [
  {
    questionKey: String,
    fieldId: String,
    label: String,
    type: String,
    required: Boolean,
    options: [String],
    conditionalRules: {
      logic: "AND" | "OR",
      conditions: [
        { questionKey, operator, value }
      ]
    }
  }
]
```

### Response model

```bash
formId: ObjectId
airtableRecordId: String
answers: Object
createdAt: Date
updatedAt: Date
deletedInAirtable: Boolean
```

### Webhook Model

```bash
userId:ObjectId
baseId: String
tableId: String
webhookId: String
webhookSecret: String
expirationTime: String
```

# Conditional Logic

A pure function:

```bash
function shouldShowQuestion(rules, answersSoFar) { ... }
```

### Rules:

```bash
If rules == null → always show

Evaluate each condition

Combine with AND/OR

Must be UI-independent (pure function)

Used by frontend to show/hide questions and backend to validate required fields.
```

# Webhook Configuration
### 1. Register Webhook (Backend → Airtable API)

Send:
```bash
    notificationUrl: process.env.WEBHOOK_RECEIVER_URL,
         specification: {
             options: {
                 filters: {
                     dataTypes: ["tableData"],
                     recordChangeScope: tableId
                    }
                }
            }
```

### 2. Airtable responds with:
```bash 
webhookId
webhookSecret
```
Store webhookSecret in mongodb


# How to run the project:
### Clone Project

```bash
git clone https://github.com/rajat-sharma-3745/airtable-form-builder.git
cd airtable-form-builder
```

### Install backend dependencies
```bash
cd backend
npm install
```

### Start Backend
```bash
npm start
```

### Install frontend dependencies
```bash
cd frontend
npm install
```

### Add .env for frontend
```bash
VITE_BACKEND_URL=https://your-backend.onrender.com
```

### Start Frontend
```bash
npm run dev
```