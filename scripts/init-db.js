#!/usr/bin/env node

/**
 * Database Initialization Script
 * This script creates databases and tables if they don't exist
 *
 * DATABASE STRUCTURE:
 * ===================
 *
 * PostgreSQL Tables (Relational Data):
 * ------------------------------------
 *
 * 1. users
 *    - id (UUID, primary key)
 *    - username (STRING(50), unique, not null)
 *    - email (STRING(100), unique, not null, validated email)
 *    - password (STRING(255), nullable for OAuth users)
 *    - role (ENUM: 'admin', 'user', default: 'user')
 *    - isActive (BOOLEAN, default: true)
 *    - provider (ENUM: 'local', 'google', 'facebook', default: 'local')
 *    - providerId (STRING(255), nullable)
 *    - profilePicture (STRING(500), nullable)
 *    - createdAt, updatedAt (timestamps)
 *
 * 2. subjects
 *    - id (UUID, primary key)
 *    - title (STRING(200), not null)
 *    - slug (STRING(250), unique, not null)
 *    - description (TEXT, nullable)
 *    - coverImage (STRING(500), nullable)
 *    - authorId (UUID, foreign key -> users.id)
 *    - displayOrder (INTEGER, default: 0)
 *    - isPublished (BOOLEAN, default: false)
 *    - createdAt, updatedAt (timestamps)
 *    - Relationships: belongsTo User (author), hasMany Topics
 *
 * 3. topics
 *    - id (UUID, primary key)
 *    - title (STRING(200), not null)
 *    - slug (STRING(250), unique, not null)
 *    - description (TEXT, nullable)
 *    - coverImage (STRING(500), nullable)
 *    - subjectId (UUID, foreign key -> subjects.id)
 *    - displayOrder (INTEGER, default: 0)
 *    - isPublished (BOOLEAN, default: false)
 *    - createdAt, updatedAt (timestamps)
 *    - Relationships: belongsTo Subject, hasMany Concepts
 *
 * 4. concepts
 *    - id (UUID, primary key)
 *    - title (STRING(200), not null)
 *    - slug (STRING(250), unique, not null)
 *    - coverImage (STRING(500), nullable)
 *    - topicId (UUID, foreign key -> topics.id)
 *    - contentId (STRING(100), nullable, MongoDB ObjectId reference)
 *    - displayOrder (INTEGER, default: 0)
 *    - isPublished (BOOLEAN, default: false)
 *    - lastRevisedOn (DATE, nullable)
 *    - createdAt, updatedAt (timestamps)
 *    - Relationships: belongsTo Topic, hasMany Ratings
 *
 * 5. ratings
 *    - id (UUID, primary key)
 *    - userId (UUID, foreign key -> users.id)
 *    - conceptId (UUID, nullable, foreign key -> concepts.id)
 *    - topicId (UUID, nullable, foreign key -> topics.id)
 *    - rating (INTEGER, 1-5, not null)
 *    - comment (TEXT, nullable)
 *    - createdAt, updatedAt (timestamps)
 *    - Indexes:
 *      * unique_user_concept_rating (userId, conceptId)
 *      * unique_user_topic_rating (userId, topicId)
 *    - Relationships: belongsTo User, Concept, Topic
 *
 * MongoDB Collections (Content Data):
 * ------------------------------------
 *
 * 1. contents
 *    - _id (ObjectId, auto-generated)
 *    - conceptId (String, unique, indexed, required) - References concepts.id from PostgreSQL
 *    - htmlContent (String, required) - Rendered HTML content
 *    - rawContent (String, required) - Raw editor content
 *    - contentType (String, enum: ['html', 'markdown', 'quill'], default: 'quill')
 *    - revisions (Array of subdocuments):
 *      * content (String, required)
 *      * revisedBy (String, required) - User ID
 *      * revisedAt (Date, default: now)
 *    - createdBy (String, required) - User ID
 *    - lastModifiedBy (String, required) - User ID
 *    - createdAt, updatedAt (timestamps)
 *    - Text indexes: htmlContent, rawContent (for full-text search)
 *
 * RELATIONSHIPS:
 * ==============
 * User (1) -> (M) Subjects (as author)
 * Subject (1) -> (M) Topics
 * Topic (1) -> (M) Concepts
 * Concept (1) -> (1) Content (MongoDB, via contentId)
 * User (1) -> (M) Ratings
 * Concept (1) -> (M) Ratings
 * Topic (1) -> (M) Ratings
 */

require('dotenv').config();
const { Client } = require('pg');
const mongoose = require('mongoose');

// PostgreSQL Configuration
const pgConfig = {
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT || 5432,
  user: process.env.PG_USERNAME || 'postgres',
  password: process.env.PG_PASSWORD || 'password',
  database: 'postgres' // Connect to default database first
};

const dbName = process.env.PG_DATABASE || 'docpress';
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/docpress';

async function initializePostgreSQL() {
  console.log('🔧 Initializing PostgreSQL...');

  const client = new Client(pgConfig);

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL server');

    // Check if database exists
    const checkDbQuery = `
      SELECT 1 FROM pg_database WHERE datname = $1
    `;
    const result = await client.query(checkDbQuery, [dbName]);

    if (result.rows.length === 0) {
      // Database doesn't exist, create it
      console.log(`📦 Creating database: ${dbName}`);
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database '${dbName}' created successfully`);
    } else {
      console.log(`✅ Database '${dbName}' already exists`);
    }

    await client.end();

    // Now connect to the actual database and sync tables
    console.log('🔧 Syncing database tables...');
    const db = require('../models/postgres');

    await db.sequelize.sync({ alter: false });
    console.log('✅ PostgreSQL tables synced successfully');

    // Close the connection
    await db.sequelize.close();

  } catch (error) {
    console.error('❌ PostgreSQL Error:', error.message);
    throw error;
  }
}

async function initializeMongoDB() {
  console.log('\n🔧 Initializing MongoDB...');

  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // MongoDB automatically creates databases and collections when you first write to them
    // Let's just verify the connection
    const dbName = mongoose.connection.db.databaseName;
    console.log(`✅ MongoDB database '${dbName}' is ready`);

    // Create indexes for the Content model
    const Content = require('../models/mongo/Content');
    await Content.createIndexes();
    console.log('✅ MongoDB indexes created');

    await mongoose.connection.close();

  } catch (error) {
    console.error('❌ MongoDB Error:', error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting database initialization...\n');

  try {
    // Initialize PostgreSQL
    await initializePostgreSQL();

    // Initialize MongoDB
    await initializeMongoDB();

    console.log('\n✅ All databases initialized successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Start your application: npm start');
    console.log('   2. Access the application at: http://localhost:3000');
    console.log('   3. Register your first admin user\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database initialization failed:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   - Ensure PostgreSQL is running');
    console.error('   - Ensure MongoDB is running');
    console.error('   - Check your .env file for correct credentials');
    console.error('   - Verify database connection details\n');
    process.exit(1);
  }
}

// Run the script
main();
