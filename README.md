# DocPress - Documentation Web Application

A comprehensive documentation platform similar to GitHub Docs, built with Node.js, Express, EJS, MongoDB, and PostgreSQL.

## Features

### Admin Features
- Complete CRUD operations for Subjects, Topics, and Concepts
- Rich text editor (Quill) for creating documentation
- Upload HTML and Markdown files
- Upload cover images for subjects, topics, and concepts
- Track revision history
- Publish/unpublish content
- Organize content with display ordering

### User Features
- Browse documentation by subjects and topics
- Search by content, author, and topics
- Rate topics and concept pages
- View documentation with left and right sidebars
- Previous/Next page navigation
- Responsive dark-themed UI
- View recently updated documentation

## Technology Stack

- **Backend**: Node.js, Express
- **View Engine**: EJS
- **Databases**:
  - PostgreSQL (metadata, users, ratings)
  - MongoDB (content storage, revisions)
- **Storage**: Local filesystem or AWS S3
- **Editor**: Quill rich text editor
- **Authentication**: Express session

## Project Structure

```
docpress/
├── config/                 # Configuration files
│   ├── database.js
│   ├── mongo.js
│   └── storage.js
├── controllers/            # Route controllers
│   ├── adminController.js
│   ├── authController.js
│   └── userController.js
├── middleware/             # Custom middleware
│   └── auth.js
├── models/
│   ├── mongo/             # MongoDB schemas
│   │   └── Content.js
│   └── postgres/          # PostgreSQL models
│       ├── User.js
│       ├── Subject.js
│       ├── Topic.js
│       ├── Concept.js
│       ├── Rating.js
│       └── index.js
├── public/                # Static assets
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
├── routes/                # Route definitions
│   ├── admin.js
│   ├── auth.js
│   └── user.js
├── scripts/               # Database & utility scripts
│   ├── init-db.js
│   ├── create-admin.js
│   └── reset-db.js
├── services/              # Business logic
│   └── storageService.js
├── uploads/               # Local file uploads
├── utils/                 # Utility functions
│   └── slugify.js
├── views/                 # EJS templates
│   ├── admin/
│   │   ├── dashboard.ejs
│   │   ├── subjects/
│   │   ├── topics/
│   │   └── concepts/
│   ├── auth/
│   │   ├── login.ejs
│   │   └── register.ejs
│   ├── user/
│   │   ├── home.ejs
│   │   ├── browse.ejs
│   │   ├── subject.ejs
│   │   ├── topic.ejs
│   │   ├── concept.ejs
│   │   └── search.ejs
│   └── partials/
│       ├── header.ejs
│       └── footer.ejs
├── .env.example           # Example environment variables
├── .gitignore
├── app.js                 # Main application file
├── package.json
└── README.md
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd docpress
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up databases**

   **PostgreSQL:**
   - Install PostgreSQL and ensure it's running

   **MongoDB:**
   - Install MongoDB and ensure it's running

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure your database credentials and other settings.

5. **Initialize databases**
   ```bash
   # This will create databases and tables if they don't exist
   npm run init-db
   ```

6. **Create an admin user**
   ```bash
   npm run create-admin
   ```
   Follow the prompts to create your first admin user.

7. **Run the application**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

8. **Access the application**
   - Open your browser and go to `http://localhost:3000`
   - Login with your admin credentials

## Database Schema

### PostgreSQL Tables

- **users**: User accounts (admin and regular users)
- **subjects**: Top-level documentation categories
- **topics**: Categories within subjects
- **concepts**: Individual documentation pages
- **ratings**: User ratings for topics and concepts

### MongoDB Collections

- **contents**: Stores the actual documentation content and revision history

## Storage Options

The application supports two storage options for uploaded files:

1. **Local Storage** (default)
   - Files are stored in the `uploads/` directory
   - Set `STORAGE_TYPE=local` in `.env`

2. **AWS S3**
   - Files are stored in an S3 bucket
   - Set `STORAGE_TYPE=s3` in `.env`
   - Configure AWS credentials in `.env`

## User Roles

### Admin
- Full access to create, edit, and delete content
- Manage subjects, topics, and concepts
- Upload documentation in various formats

### Regular User
- Browse and read documentation
- Search for content
- Rate topics and concepts
- View documentation with navigation

## Features in Detail

### Admin Panel
- Dashboard with statistics
- Subject management with cover images
- Topic organization within subjects
- Concept creation with Quill editor
- File upload support (HTML, Markdown)
- Content revision tracking

### User Interface
- Dark-themed design
- Three-column layout on documentation pages:
  - Left sidebar: Navigation tree
  - Main content: Documentation
  - Right sidebar: Related topics
- Previous/Next page navigation
- Rating system with star ratings
- Advanced search functionality

## Available Scripts

```bash
# Start the application
npm start

# Run in development mode with auto-reload
npm run dev

# Initialize databases (creates DB and tables if they don't exist)
npm run init-db

# Create an admin user (interactive)
npm run create-admin

# Reset databases (WARNING: Deletes all data!)
npm run reset-db
```

## Development

```bash
# Install development dependencies
npm install

# Run in development mode with nodemon
npm run dev
```

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start app.js --name docpress
   ```

## Security Notes

- Change `SESSION_SECRET` in production
- Use HTTPS in production
- Keep database credentials secure
- Implement rate limiting for production
- Validate and sanitize user inputs

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
