# API Endpoints Testing Guide

## Quick Start
1. Start server: `node server.js`
2. Server runs on `http://localhost:5000`

---

## API Endpoints Created

### 1️⃣ POST `/api/files` - Create New Memory
**Purpose:** Save a new memory (photo, note, voice, or document) to database

**How to test (using curl or Postman):**
```bash
curl -X POST http://localhost:5000/api/files \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Memory",
    "description": "This is a test memory",
    "type": "note",
    "content": "This is the actual content stored in base64 or text",
    "thumbnail": "data:image/jpeg;base64,..."
  }'
```

**Expected Response (201 Created):**
```json
{
  "message": "Memory saved successfully! ✅",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "My First Memory",
    "description": "This is a test memory",
    "type": "note",
    "content": "This is the actual content",
    "thumbnail": "...",
    "createdAt": "2026-03-23T15:00:00.000Z",
    "updatedAt": "2026-03-23T15:00:00.000Z"
  }
}
```

---

### 2️⃣ GET `/api/files` - Fetch All Memories
**Purpose:** Get list of all memories from database

**How to test:**
```bash
curl http://localhost:5000/api/files
```

**Expected Response (200 OK):**
```json
{
  "message": "Memories fetched successfully ✅",
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "My First Memory",
      "type": "note",
      ...
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "My Second Memory",
      "type": "photo",
      ...
    }
  ]
}
```

---

### 3️⃣ GET `/api/files/:id` - Fetch Single Memory
**Purpose:** Get one specific memory by its ID

**How to test:**
```bash
curl http://localhost:5000/api/files/507f1f77bcf86cd799439011
```

**Expected Response (200 OK):**
```json
{
  "message": "Memory fetched successfully ✅",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "My First Memory",
    "description": "This is a test memory",
    "type": "note",
    "content": "...",
    "createdAt": "2026-03-23T15:00:00.000Z"
  }
}
```

---

### 4️⃣ DELETE `/api/files/:id` - Delete Memory
**Purpose:** Remove a memory from database

**How to test:**
```bash
curl -X DELETE http://localhost:5000/api/files/507f1f77bcf86cd799439011
```

**Expected Response (200 OK):**
```json
{
  "message": "Memory deleted successfully ✅",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "My First Memory",
    ...
  }
}
```

---

## HTTP Status Codes Explained

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | GET/DELETE successful |
| 201 | Created | POST successful (new item created) |
| 400 | Bad Request | Missing required fields |
| 404 | Not Found | Memory ID doesn't exist |
| 500 | Server Error | Database or other error |

---

## Error Responses

**Missing Required Field (400):**
```json
{
  "error": "Title, type, and content are required"
}
```

**Memory Not Found (404):**
```json
{
  "error": "Memory not found"
}
```

**Database Error (500):**
```json
{
  "error": "Error saving memory",
  "details": "..."
}
```

---

## Using Postman to Test

1. Open Postman
2. Create new request
3. Set method: POST/GET/DELETE
4. Set URL: `http://localhost:5000/api/files` (with ID if needed)
5. For POST: Go to Body → Raw → JSON, paste your data
6. Click Send

---

## What Each Endpoint Does (Line-by-Line Explanation)

### POST /api/files (Lines 38-67)
- `async (req, res)` → Function that handles the request
- `const { title, ... } = req.body` → Extract data from request
- `if (!title || !type || !content)` → Check if required fields exist
- `new File({...})` → Create new memory object
- `await newFile.save()` → Save to MongoDB (wait for it to finish)
- `res.status(201).json({...})` → Send back success message + saved data

### GET /api/files (Lines 70-83)
- `await File.find()` → Get ALL memories from database
- `count: files.length` → Tell frontend how many memories exist
- Returns all memories in `data` array

### GET /api/files/:id (Lines 86-104)
- `const { id } = req.params` → Get ID from URL (e.g., `/api/files/12345`)
- `await File.findById(id)` → Find ONE specific memory by ID
- `if (!file)` → If not found, return 404 error
- Returns single memory in `data`

### DELETE /api/files/:id (Lines 107-125)
- `await File.findByIdAndDelete(id)` → Remove memory from database
- Returns deleted memory (so frontend knows what was deleted)
- If not found, returns 404 error
