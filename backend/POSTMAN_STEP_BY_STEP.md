# 📮 Postman Testing Guide - Step By Step

## Setup (One-time)

### Step 1: Start Your Server FIRST
Before opening Postman, your server must be running:

```
1. Open Terminal/Command Prompt
2. Type: cd "C:\Users\sstos\Desktop\Memory Vault\memory-vault\backend"
3. Type: node server.js
4. You should see:
   ✅ Connected to Mongodb!
   ✅ server is running on http://localhost:5000
```

**Leave this terminal running in background** - don't close it!

---

## Test 1️⃣: CREATE A MEMORY (POST)

This tests saving a new memory to the database.

### Step-by-Step:

**1. Open Postman** (from your screenshot, you already have it open)

**2. Set the HTTP Method** (top left dropdown)
   - Currently shows: `POST` ✓ (this is correct!)
   - If not, click dropdown and select **POST**

**3. Enter the URL** (in the address bar)
   - Clear the address bar
   - Type: `http://localhost:5000/api/files`

**4. Go to "Body" tab** (below the URL bar)
   - Click on the **Body** tab
   - Click on **raw** option (it might show "form-data" by default)
   - Click dropdown on right that says **Text** → change to **JSON**

**5. Paste this data in the Body area:**
```json
{
  "title": "My First Memory",
  "description": "This is my first saved memory!",
  "type": "note",
  "content": "This is the actual content of my memory stored in the database",
  "thumbnail": "optional_image_url_here"
}
```

**6. Click "Send"** button (blue button on right)

**7. Check the Response** (bottom section)
You should see something like:
```json
{
    "message": "Memory saved successfully! ✅",
    "data": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
        "title": "My First Memory",
        "description": "This is my first saved memory!",
        "type": "note",
        "content": "This is the actual content of my memory stored in the database",
        "thumbnail": "optional_image_url_here",
        "createdAt": "2026-03-23T15:56:56.776Z",
        "updatedAt": "2026-03-23T15:56:56.776Z",
        "__v": 0
    }
}
```

✅ **Success!** Your memory is now in the database!

**⚠️ Important:** Copy the `_id` value from the response (e.g., `65a1b2c3d4e5f6g7h8i9j0k1`) - you'll need it for the next tests!

---

## Test 2️⃣: GET ALL MEMORIES (GET)

This tests fetching all memories from the database.

### Step-by-Step:

**1. Change HTTP Method**
   - Click dropdown at top left (currently shows POST)
   - Select **GET**

**2. Enter URL**
   - Change URL to: `http://localhost:5000/api/files`
   - (Remove `/api/files` if there, and type it exactly)

**3. Click "Body" tab**
   - For GET requests, you usually don't send body data
   - Leave Body empty ✓

**4. Click "Send"**

**5. Check Response**
You should see all memories saved in database:
```json
{
    "message": "Memories fetched successfully ✅",
    "count": 1,
    "data": [
        {
            "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
            "title": "My First Memory",
            "description": "This is my first saved memory!",
            "type": "note",
            "content": "This is the actual content...",
            "createdAt": "2026-03-23T15:56:56.776Z",
            "updatedAt": "2026-03-23T15:56:56.776Z"
        }
    ]
}
```

✅ **Success!** The count shows how many memories exist. `"count": 1` means you have 1 memory.

---

## Test 3️⃣: GET ONE MEMORY (GET with ID)

This tests fetching a specific memory by its ID.

### Step-by-Step:

**1. HTTP Method is already GET** ✓

**2. Enter URL with the ID**
   - Use the `_id` you copied from Test 1
   - Type: `http://localhost:5000/api/files/65a1b2c3d4e5f6g7h8i9j0k1`
   - Replace `65a1b2c3d4e5f6g7h8i9j0k1` with your actual ID!

**3. Click "Send"**

**4. Check Response**
You should see just that ONE memory:
```json
{
    "message": "Memory fetched successfully ✅",
    "data": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
        "title": "My First Memory",
        "description": "This is my first saved memory!",
        "type": "note",
        "content": "This is the actual content...",
        "createdAt": "2026-03-23T15:56:56.776Z",
        "updatedAt": "2026-03-23T15:56:56.776Z"
    }
}
```

✅ **Success!** You fetched one specific memory!

---

## Test 4️⃣: CREATE ANOTHER MEMORY (POST again)

Before deleting, let's create another memory so we have 2.

### Step-by-Step:

**1. Change HTTP Method to POST** (top left dropdown)

**2. URL**
   - Type: `http://localhost:5000/api/files`

**3. Body tab → raw → JSON**

**4. Paste different data:**
```json
{
  "title": "My Photo Memory",
  "description": "A beautiful photo I want to remember",
  "type": "photo",
  "content": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA...",
  "thumbnail": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA..."
}
```

**5. Click Send**

**6. Copy the NEW `_id`** from the response - you'll need this for delete test!

---

## Test 5️⃣: DELETE A MEMORY (DELETE)

This tests removing a memory from the database.

### Step-by-Step:

**1. Change HTTP Method to DELETE** (top left dropdown)

**2. Enter URL with ID**
   - Use the ID from your SECOND memory (from Test 4)
   - Type: `http://localhost:5000/api/files/[paste_the_id_here]`
   - Example: `http://localhost:5000/api/files/65a1b2c3d4e5f6g7h8i9j0k2`

**3. Body tab** - Leave EMPTY (no body needed for DELETE)

**4. Click "Send"**

**5. Check Response**
You should see the deleted memory returned:
```json
{
    "message": "Memory deleted successfully ✅",
    "data": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "title": "My Photo Memory",
        "description": "A beautiful photo I want to remember",
        "type": "photo",
        "content": "...",
        "createdAt": "2026-03-23T15:56:56.776Z",
        "updatedAt": "2026-03-23T15:56:56.776Z"
    }
}
```

✅ **Success!** Memory deleted from database!

**Verify it's gone:** Run Test 2 again (GET all memories) - now `count` should be `1` instead of `2`!

---

## Quick Reference Table

| Test | Method | URL | Body | Expected |
|------|--------|-----|------|----------|
| Create | POST | `/api/files` | JSON data | 201 + new memory |
| Get All | GET | `/api/files` | Empty | 200 + all memories array |
| Get One | GET | `/api/files/[ID]` | Empty | 200 + single memory |
| Delete | DELETE | `/api/files/[ID]` | Empty | 200 + deleted memory |

---

## Common Issues & Fixes

### ❌ "Cannot GET /api/files"
- Make sure server is running (`node server.js`)
- Check URL is exactly correct: `http://localhost:5000/api/files`

### ❌ "Cannot POST /api/files"
- Make sure HTTP method is set to POST
- Check Body is set to "raw" and "JSON"

### ❌ "Memory not found" (404)
- ID doesn't exist
- Copy the full `_id` from a previous response
- Make sure no extra spaces

### ❌ "Title, type, and content are required"
- In POST, you forgot one of these fields
- Copy the exact JSON from the example above

### ❌ Server won't start
- Check MongoDB connection string is correct
- Make sure you're in backend folder: `cd backend`
- Check if port 5000 is already in use (close other apps)

---

## Summary of What You've Done

✅ Created 4 working API endpoints
✅ Tested POST - saved data to database
✅ Tested GET - retrieved all data
✅ Tested GET with ID - retrieved specific data
✅ Tested DELETE - removed data

**Next Phase:** Connect frontend to these APIs! 🚀
