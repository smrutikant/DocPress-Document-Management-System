# Testing File Upload and Content Saving

## Complete Test Flow

### 1. Test File Upload (HTML/MD → Quill Editor)

1. Go to: `http://localhost:3000/admin/concepts/create`
2. Open browser console (F12 → Console)
3. You should see:
   ```
   Script running - Quill library available: true
   Editor element exists: true
   ✅ Quill editor initialized: true
   ✅ Form submit listener attached
   ```

4. Upload a `.md` or `.html` file:
   - Click the file upload input
   - Select your file
   - **Check console logs**:
     ```
     Uploading file: yourfile.md
     Response status: 200
     Response data: {success: true, content: "..."}
     File uploaded successfully!
     ```
   - The content should appear in the Quill editor

### 2. Test Content Saving (Quill Editor → Database)

1. Fill in the form:
   - Title: "Test Concept"
   - Topic: (select any)
   - Content should be in the editor from the upload

2. Click "Create Concept"

3. **Check browser console logs**:
   ```
   Form submitting...
   ✅ Content saved to hidden field, length: XXXX
   Hidden field value length: XXXX
   ```

4. **Check server console logs**:
   ```
   Creating concept with content length: XXXX
   Content saved to MongoDB, ID: ...
   ```

5. **Verify redirect** to `/admin/concepts` with success message

### 3. Test Content Display (User View)

1. Go to the concept list: `/admin/concepts`
2. Find your created concept
3. Click to view it on the frontend
4. **Content should display** in the user view

### 4. Test Content Editing

1. Go to: `/admin/concepts`
2. Click "Edit" on your test concept
3. **Check browser console**:
   ```
   Script running - Quill library available: true
   ✅ Loaded existing content, length: XXXX
   ✅ Quill editor initialized: true
   ```
4. The content should load in the editor
5. Make changes and click "Update Concept"
6. Content should save and display correctly

## Expected Behavior

✅ File upload loads content into editor
✅ Content saves to hidden field on form submit
✅ Content persists to MongoDB
✅ Content displays in user view
✅ Content loads correctly when editing

## If Something Fails

Check these logs in order:

1. **Browser console** - Shows client-side issues
2. **Server console** - Shows backend issues
3. **Network tab** - Shows request/response data
4. **MongoDB** - Check if content was actually saved

## Quick Database Check

```bash
# Connect to MongoDB
mongosh docpress

# Check if content exists
db.contents.find({}).pretty()

# Find specific concept content
db.contents.findOne({ conceptId: "your-concept-id" })
```
