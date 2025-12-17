require('dotenv').config();
const { Sequelize } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'docpress',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false
  }
);

// Define topics data
const topics = require('./js-topics-data.json');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL');

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/docpress');
    console.log('Connected to MongoDB');

    // Get or create JavaScript subject
    const [rows] = await sequelize.query(`
      INSERT INTO subjects (id, title, slug, description, "displayOrder", "isPublished", "authorId", "createdAt", "updatedAt")
      VALUES (
        '${uuidv4()}', 'JavaScript', 'javascript',
        'Comprehensive JavaScript documentation covering basics to advanced concepts',
        1, true,
        (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
        NOW(), NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title
      RETURNING id
    `);

    const subjectId = rows[0].id;
    console.log('Subject created:', subjectId);

    const Content = mongoose.model('Content', new mongoose.Schema({
      conceptId: String,
      htmlContent: String,
      rawContent: String
    }));

    for (let i = 0; i < topics.length; i++) {
      const topicData = topics[i];
      
      const [topicRows] = await sequelize.query(`
        INSERT INTO topics (id, title, slug, description, "subjectId", "displayOrder", "isPublished", "createdAt", "updatedAt")
        VALUES ('${uuidv4()}', $1, $2, $3, '${subjectId}', ${i + 1}, true, NOW(), NOW())
        ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title
        RETURNING id
      `, {
        bind: [
          topicData.title,
          topicData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          topicData.description
        ]
      });

      const topicId = topicRows[0].id;
      console.log('Topic created:', topicData.title);

      for (let j = 0; j < topicData.concepts.length; j++) {
        const concept = topicData.concepts[j];
        const conceptId = uuidv4();

        const mongoContent = await Content.create({
          conceptId: conceptId,
          htmlContent: concept.content,
          rawContent: concept.content
        });

        await sequelize.query(`
          INSERT INTO concepts (
            id, title, slug, "topicId", "contentId",
            "displayOrder", "isPublished", "createdAt", "updatedAt", "lastRevisedOn"
          )
          VALUES ($1, $2, $3, '${topicId}', '${mongoContent._id.toString()}', ${j + 1}, true, NOW(), NOW(), NOW())
          ON CONFLICT (slug) DO NOTHING
        `, {
          bind: [
            conceptId,
            concept.title,
            concept.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          ]
        });

        console.log('  Concept created:', concept.title);
      }
    }

    console.log('Done! Created', topics.length, 'topics');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
    await mongoose.connection.close();
  }
}

seed();
