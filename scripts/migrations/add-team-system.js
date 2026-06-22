require('dotenv').config();
const db = require('../../models/postgres');

async function migrate() {
  try {
    console.log('Starting team system migration...');

    // Sync database with alter: true to add new columns and tables
    await db.sequelize.sync({ alter: true });

    console.log('✅ Team system migration completed successfully!');
    console.log('\nNew tables created:');
    console.log('  - teams');
    console.log('  - team_members');
    console.log('  - team_requests');
    console.log('\nNew columns added to subjects:');
    console.log('  - teamId (nullable)');
    console.log('  - visibility (default: public)');
    console.log('  - requiresApproval (default: false)');
    console.log('  - approvedBy (nullable)');
    console.log('  - approvedAt (nullable)');

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
