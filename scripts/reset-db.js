#!/usr/bin/env node

/**
 * Database Reset Script
 * WARNING: This will DROP all databases and recreate them
 * Use with caution!
 */

require('dotenv').config();
const { Client } = require('pg');
const mongoose = require('mongoose');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

// PostgreSQL Configuration
const pgConfig = {
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT || 5432,
  user: process.env.PG_USERNAME || 'postgres',
  password: process.env.PG_PASSWORD || 'password',
  database: 'postgres'
};

const dbName = process.env.PG_DATABASE || 'docpress';
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/docpress';

async function resetPostgreSQL() {
  console.log('🔧 Resetting PostgreSQL database...');

  const client = new Client(pgConfig);

  try {
    await client.connect();

    // Terminate existing connections
    await client.query(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = $1
        AND pid <> pg_backend_pid()
    `, [dbName]);

    // Drop database if exists
    await client.query(`DROP DATABASE IF EXISTS ${dbName}`);
    console.log(`✅ Database '${dbName}' dropped`);

    // Create database
    await client.query(`CREATE DATABASE ${dbName}`);
    console.log(`✅ Database '${dbName}' created`);

    await client.end();

    // Sync tables
    const db = require('../models/postgres');
    await db.sequelize.sync({ force: true });
    console.log('✅ PostgreSQL tables created');
    await db.sequelize.close();

  } catch (error) {
    console.error('❌ PostgreSQL Error:', error.message);
    throw error;
  }
}

async function resetMongoDB() {
  console.log('\n🔧 Resetting MongoDB database...');

  try {
    await mongoose.connect(mongoUri);

    // Drop database
    await mongoose.connection.db.dropDatabase();
    console.log('✅ MongoDB database dropped and recreated');

    // Create indexes
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
  console.log('⚠️  WARNING: This will DELETE all data!\n');

  const confirm = await question('Are you sure you want to reset all databases? (yes/no): ');

  if (confirm.toLowerCase() !== 'yes') {
    console.log('\n❌ Operation cancelled');
    rl.close();
    process.exit(0);
  }

  console.log('\n🚀 Starting database reset...\n');

  try {
    await resetPostgreSQL();
    await resetMongoDB();

    console.log('\n✅ All databases have been reset!');
    console.log('\n📝 Next steps:');
    console.log('   1. Run: npm run create-admin');
    console.log('   2. Start your application: npm start\n');

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database reset failed:', error.message);
    rl.close();
    process.exit(1);
  }
}

// Run the script
main();
