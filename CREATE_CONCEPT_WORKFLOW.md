# Create New Concept - Complete Workflow

## Overview
The "Create Concept" page is where admins/team admins create detailed documentation pages (concepts) that belong to a specific topic. It uses a rich text editor (Quill.js) and stores data in both PostgreSQL and MongoDB.

## Architecture

### Dual Database System
- **PostgreSQL**: Stores concept metadata (title, slug, topic relation, display order, etc.)
- **MongoDB**: Stores the rich HTML content (the actual documentation body)

This separation allows:
- Fast queries for concept lists/navigation (PostgreSQL)
- Efficient storage of large HTML content (MongoDB)
- Support for content revisions/history (MongoDB)

---

## Step-by-Step Workflow

### 1. **Page Load** (`GET /admin/concepts/create`)

**Route:** `routes/admin.js`
```javascript
router.get('/concepts/create', isAdminOrTeamAdmin, adminController.createConceptForm);
```

**Controller:** `adminController.createConceptForm()`
```javascript
exports.createConceptForm = async (req, res) => {
  // Fetch all published topics with their subject names
  const topics = await Topic.findAll({
    where: { isPublished: true },
    include: [{ model: Subject, as: 'subject', attributes: ['title'] }]
  });

  // Check if topicId was passed in query string (e.g., from topic list page)
  const selectedTopicId = req.query.topicId || null;

  // Render the create form
  res.render('admin/concepts/create', {
    title: 'Create Concept',
    topics,
    selectedTopicId
  });
};
```

**What happens:**
- Queries PostgreSQL for all published topics
- Includes parent subject names for dropdown display
- Checks URL for `?topicId=xyz` parameter (for pre-selection)
- Renders the form view

---

### 2. **Form Elements** (View: `views/admin/concepts/create.ejs`)

#### A. Basic Fields
```html
<!-- Title (Required) -->
<input type="text" id="title" name="title" required>

<!-- Topic Selection (Required) -->
<select id="topicId" name="topicId" required>
  <option value="">Select a topic</option>
  <!-- Shows: "Subject Name / Topic Name" -->
  <option value="topic-uuid">Mathematics / Algebra</option>
</select>

<!-- Cover Image (Optional) -->
<input type="file" id="coverImage" name="coverImage" accept="image/*">

<!-- Display Order -->
<input type="number" id="displayOrder" name="displayOrder" value="0">

<!-- Publish Immediately Checkbox -->
<input type="checkbox" name="isPublished" checked>
```

#### B. Rich Text Editor (Quill.js)

```html
<!-- File Upload for importing HTML/Markdown (Optional) -->
<input type="file" id="fileUpload" accept=".html,.md,.markdown"
       onchange="uploadFile(this, 'editor')">

<!-- Quill Editor Container -->
<div id="editor" style="height: 400px;"></div>

<!-- Hidden Field - Stores HTML content for submission -->
<input type="hidden" id="content" name="content">
```

---

### 3. **JavaScript Initialization** (Client-Side)

#### A. Quill Editor Setup
```javascript
// Initialize Quill rich text editor
window.quillEditor = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ]
  }
});
```

**Toolbar Features:**
- Headers (H1-H6)
- Text formatting (bold, italic, underline, strike)
- Code blocks and blockquotes
- Ordered/unordered lists
- Subscript/superscript
- Indentation
- Text color and background
- Alignment
- Links and images
- Clear formatting

#### B. Form Submit Handler
```javascript
form.addEventListener('submit', function(e) {
  // Extract HTML content from Quill editor
  const contentHtml = window.quillEditor.root.innerHTML;

  // Store in hidden field for form submission
  document.getElementById('content').value = contentHtml;

  console.log('Content saved, length:', contentHtml.length);
});
```

**What happens on submit:**
1. Quill editor content is extracted as HTML
2. HTML is stored in the hidden `content` field
3. Form submits with all data

#### C. Cover Image Preview
```javascript
function previewCoverImage(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      // Show image preview
      document.getElementById('previewImg').src = e.target.result;
      document.getElementById('imagePreview').style.display = 'block';
    };
    reader.readAsDataURL(input.files[0]);
  }
}
```

---

### 4. **Form Submission** (`POST /admin/concepts/create`)

**Route:** `routes/admin.js`
```javascript
router.post('/concepts/create',
  isAdminOrTeamAdmin,
  uploadImage.single('coverImage'),
  adminController.createConcept
);
```

**Middleware Chain:**
1. `isAdminOrTeamAdmin` - Checks user has permission
2. `uploadImage.single('coverImage')` - Handles file upload to storage
3. `adminController.createConcept` - Processes the form

---

### 5. **Controller Processing** (`adminController.createConcept()`)

```javascript
exports.createConcept = async (req, res) => {
  try {
    // 1. Extract form data
    const { title, topicId, displayOrder, isPublished, content } = req.body;
    const slug = slugify(title); // e.g., "Introduction to Algebra" → "introduction-to-algebra"
    const coverImage = req.file ? normalizeFilePath(req.file.path) : null;

    console.log('Creating concept:', { title, topicId, contentLength: content?.length });

    // 2. Create concept record in PostgreSQL
    const concept = await Concept.create({
      title,
      slug,
      topicId,
      coverImage,
      displayOrder: displayOrder || 0,
      isPublished: isPublished === 'on',
      lastRevisedOn: new Date()
    });
    console.log('✅ Concept created in PostgreSQL, ID:', concept.id);

    // 3. Create content document in MongoDB
    const mongoContent = await Content.create({
      conceptId: concept.id,           // Links to PostgreSQL concept
      htmlContent: content || '',      // Rich HTML from Quill
      rawContent: content || '',       // Same for now (could be markdown in future)
      contentType: 'quill',            // Editor type used
      createdBy: req.session.userId,   // Track who created it
      lastModifiedBy: req.session.userId,
      revisions: []                    // Array for future revision tracking
    });
    console.log('✅ Content saved to MongoDB, _id:', mongoContent._id);

    // 4. Update PostgreSQL concept with MongoDB reference
    await concept.update({
      contentId: mongoContent._id.toString()
    });
    console.log('✅ Concept updated with contentId');

    // 5. Success - redirect to concepts list
    req.flash('success', 'Concept created successfully');
    res.redirect('/admin/concepts');

  } catch (error) {
    console.error('Create concept error:', error);
    req.flash('error', 'Failed to create concept');
    res.redirect('/admin/concepts/create');
  }
};
```

---

## Database Operations

### Step 1: PostgreSQL Insert

```sql
INSERT INTO concepts (
  id,
  title,
  slug,
  "topicId",
  "coverImage",
  "displayOrder",
  "isPublished",
  "lastRevisedOn",
  "createdAt",
  "updatedAt"
) VALUES (
  'abc-123-uuid',
  'Introduction to Algebra',
  'introduction-to-algebra',
  'topic-uuid-456',
  '/uploads/coverImage-123.png',
  0,
  true,
  '2026-06-19 10:30:00',
  '2026-06-19 10:30:00',
  '2026-06-19 10:30:00'
);
```

**Result:**
```javascript
concept = {
  id: 'abc-123-uuid',
  title: 'Introduction to Algebra',
  slug: 'introduction-to-algebra',
  topicId: 'topic-uuid-456',
  coverImage: '/uploads/coverImage-123.png',
  contentId: null,  // Will be updated in step 3
  displayOrder: 0,
  isPublished: true,
  lastRevisedOn: 2026-06-19T10:30:00.000Z
}
```

### Step 2: MongoDB Insert

```javascript
db.contents.insertOne({
  conceptId: 'abc-123-uuid',
  htmlContent: '<h1>Introduction</h1><p>This is about algebra...</p>',
  rawContent: '<h1>Introduction</h1><p>This is about algebra...</p>',
  contentType: 'quill',
  createdBy: 'user-uuid-789',
  lastModifiedBy: 'user-uuid-789',
  revisions: [],
  createdAt: ISODate('2026-06-19T10:30:00.000Z'),
  updatedAt: ISODate('2026-06-19T10:30:00.000Z')
});
```

**Result:**
```javascript
mongoContent = {
  _id: ObjectId('507f1f77bcf86cd799439011'),
  conceptId: 'abc-123-uuid',
  htmlContent: '<h1>Introduction</h1><p>This is about algebra...</p>',
  rawContent: '<h1>Introduction</h1><p>This is about algebra...</p>',
  contentType: 'quill',
  createdBy: 'user-uuid-789',
  lastModifiedBy: 'user-uuid-789',
  revisions: []
}
```

### Step 3: PostgreSQL Update

```sql
UPDATE concepts
SET "contentId" = '507f1f77bcf86cd799439011'
WHERE id = 'abc-123-uuid';
```

**Final State:**
```javascript
concept = {
  id: 'abc-123-uuid',
  title: 'Introduction to Algebra',
  slug: 'introduction-to-algebra',
  topicId: 'topic-uuid-456',
  coverImage: '/uploads/coverImage-123.png',
  contentId: '507f1f77bcf86cd799439011',  // ✅ Now linked to MongoDB
  displayOrder: 0,
  isPublished: true,
  lastRevisedOn: 2026-06-19T10:30:00.000Z
}
```

---

## Data Flow Diagram

```
User fills form
    ↓
[Title] [Topic] [Cover Image] [Content in Quill Editor]
    ↓
Click "Create Concept"
    ↓
JavaScript extracts Quill HTML → Hidden field
    ↓
Form POST to /admin/concepts/create
    ↓
Multer middleware handles cover image upload
    ↓
Controller receives:
  - title: "Introduction to Algebra"
  - topicId: "topic-uuid-456"
  - coverImage: File object
  - content: "<h1>Introduction</h1><p>..."
    ↓
1. Create in PostgreSQL (metadata)
   → Returns concept with ID
    ↓
2. Create in MongoDB (content)
   → Returns document with _id
    ↓
3. Update PostgreSQL concept.contentId = MongoDB._id
    ↓
Success! Redirect to /admin/concepts
```

---

## Key Features

### 1. **Pre-selected Topic**
If you click "Add Concept" from a topic page:
```
URL: /admin/concepts/create?topicId=abc-123
```
The topic dropdown will be:
- Pre-selected to that topic
- Disabled (cannot change)
- Hidden field passes the value

### 2. **File Upload (Import)**
Upload HTML or Markdown files to import content:
```javascript
// File is uploaded to /admin/upload-file endpoint
// Returns HTML content
// Inserts into Quill editor
```

### 3. **Cover Image Preview**
Real-time preview before upload using FileReader API

### 4. **Revision Tracking** (Future)
MongoDB schema includes `revisions` array:
```javascript
revisions: [
  {
    content: '<h1>Old content</h1>',
    revisedBy: 'user-uuid',
    revisedAt: Date
  }
]
```

---

## Security & Validation

### Server-Side Validation
- ✅ User must be authenticated (`isAdminOrTeamAdmin`)
- ✅ Topic must exist and be published
- ✅ Title is required
- ✅ Slug generated server-side (prevents injection)
- ✅ File upload validated (image types only)

### Client-Side Validation
- ✅ Required fields (title, topic)
- ✅ File type validation (images only)
- ✅ Content extracted from Quill (prevents raw HTML injection)

---

## Error Handling

```javascript
try {
  // Create concept
} catch (error) {
  console.error('Create concept error:', error);
  req.flash('error', 'Failed to create concept');
  res.redirect('/admin/concepts/create');
}
```

**Common Errors:**
- Topic not found → Validation error
- MongoDB connection issue → Database error
- File upload fails → Storage error
- Duplicate slug → Unique constraint error

---

## Summary

**The Create Concept workflow:**

1. **Load Form** → Fetch topics from PostgreSQL
2. **User Input** → Fill title, select topic, write content in Quill
3. **Submit** → JavaScript extracts HTML from Quill to hidden field
4. **Upload** → Cover image processed by Multer
5. **Store Metadata** → PostgreSQL stores concept info
6. **Store Content** → MongoDB stores HTML content
7. **Link** → PostgreSQL concept.contentId references MongoDB document
8. **Success** → Redirect to concepts list

**Result:** A fully linked concept with metadata in PostgreSQL and rich content in MongoDB, ready to be displayed to users!
