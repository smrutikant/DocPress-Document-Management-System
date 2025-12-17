#!/usr/bin/env node

/**
 * Create Admin User Script
 * This script creates an admin user for the application
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const readline = require('readline');
const db = require('../models/postgres');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function createAdminUser() {
  console.log('🔧 Create Admin User\n');

  try {
    // Sync database
    await db.sequelize.sync();
    console.log('✅ Database connected\n');

    // Get user input
    const username = await question('Enter admin username: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password: ');

    if (!username || !email || !password) {
      console.log('\n❌ All fields are required!');
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      console.log('\n❌ A user with this email already exists!');
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = await db.User.create({
      username,
      email,
      password: hashedPassword,
      role: 'admin',
      isActive: true
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('\n📝 User Details:');
    console.log(`   Username: ${admin.username}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   ID: ${admin.id}\n`);

    await db.sequelize.close();
    rl.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error creating admin user:', error.message);
    await db.sequelize.close();
    rl.close();
    process.exit(1);
  }
}

// Run the script
createAdminUser();
