require('dotenv').config();
const db = require('../models/postgres');
const Content = require('../models/mongo/Content');
const connectMongo = require('../config/mongo');

async function clearAllContent() {
  try {
    console.log('🗑️  Starting content cleanup...\n');

    // Connect to MongoDB
    await connectMongo();

    // Get counts before deletion
    const conceptCount = await db.Concept.count();
    const topicCount = await db.Topic.count();
    const subjectCount = await db.Subject.count();
    const mongoContentCount = await Content.countDocuments();

    console.log('Current content:');
    console.log(`  - Concepts: ${conceptCount}`);
    console.log(`  - Topics: ${topicCount}`);
    console.log(`  - Subjects: ${subjectCount}`);
    console.log(`  - MongoDB Content: ${mongoContentCount}\n`);

    // Delete MongoDB content
    console.log('Deleting MongoDB content...');
    const mongoResult = await Content.deleteMany({});
    console.log(`✅ Deleted ${mongoResult.deletedCount} MongoDB content documents\n`);

    // Delete PostgreSQL content (in order due to foreign key constraints)
    console.log('Deleting PostgreSQL content...');

    // 1. Delete concepts first
    const deletedConcepts = await db.Concept.destroy({ where: {}, truncate: false });
    console.log(`✅ Deleted ${deletedConcepts} concepts`);

    // 2. Delete topics
    const deletedTopics = await db.Topic.destroy({ where: {}, truncate: false });
    console.log(`✅ Deleted ${deletedTopics} topics`);

    // 3. Delete subjects
    const deletedSubjects = await db.Subject.destroy({ where: {}, truncate: false });
    console.log(`✅ Deleted ${deletedSubjects} subjects`);

    // Also delete ratings if any
    const deletedRatings = await db.Rating.destroy({ where: {}, truncate: false });
    console.log(`✅ Deleted ${deletedRatings} ratings\n`);

    console.log('✨ All documentation content has been cleared!');
    console.log('\nNote: Users and their accounts remain intact.');
    console.log('You can now start creating fresh content with the new team system.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing content:', error);
    process.exit(1);
  }
}

clearAllContent();
