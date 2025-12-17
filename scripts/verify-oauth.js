#!/usr/bin/env node

/**
 * OAuth Configuration Verification Script
 * Checks if OAuth environment variables are properly configured
 */

require('dotenv').config();

console.log('🔍 Verifying OAuth Configuration...\n');

let hasErrors = false;

// Google OAuth Verification
console.log('📍 Google OAuth:');
console.log('─────────────────────────────────────');

if (!process.env.GOOGLE_CLIENT_ID) {
  console.log('❌ GOOGLE_CLIENT_ID is missing');
  hasErrors = true;
} else {
  console.log(`✅ GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID.substring(0, 20)}...`);

  // Check format
  if (!process.env.GOOGLE_CLIENT_ID.endsWith('.apps.googleusercontent.com')) {
    console.log('⚠️  Warning: GOOGLE_CLIENT_ID should end with .apps.googleusercontent.com');
  }
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  console.log('❌ GOOGLE_CLIENT_SECRET is missing');
  hasErrors = true;
} else {
  console.log(`✅ GOOGLE_CLIENT_SECRET: ${process.env.GOOGLE_CLIENT_SECRET.substring(0, 10)}...`);
}

if (!process.env.GOOGLE_CALLBACK_URL) {
  console.log('❌ GOOGLE_CALLBACK_URL is missing');
  hasErrors = true;
} else {
  console.log(`✅ GOOGLE_CALLBACK_URL: ${process.env.GOOGLE_CALLBACK_URL}`);

  // Validate callback URL format
  if (!process.env.GOOGLE_CALLBACK_URL.includes('/google/callback')) {
    console.log('⚠️  Warning: GOOGLE_CALLBACK_URL should contain /google/callback');
  }
}

console.log('\n📍 Facebook OAuth:');
console.log('─────────────────────────────────────');

if (!process.env.FACEBOOK_APP_ID) {
  console.log('❌ FACEBOOK_APP_ID is missing');
  hasErrors = true;
} else {
  console.log(`✅ FACEBOOK_APP_ID: ${process.env.FACEBOOK_APP_ID}`);
}

if (!process.env.FACEBOOK_APP_SECRET) {
  console.log('❌ FACEBOOK_APP_SECRET is missing');
  hasErrors = true;
} else {
  console.log(`✅ FACEBOOK_APP_SECRET: ${process.env.FACEBOOK_APP_SECRET.substring(0, 10)}...`);
}

if (!process.env.FACEBOOK_CALLBACK_URL) {
  console.log('❌ FACEBOOK_CALLBACK_URL is missing');
  hasErrors = true;
} else {
  console.log(`✅ FACEBOOK_CALLBACK_URL: ${process.env.FACEBOOK_CALLBACK_URL}`);

  // Validate callback URL format
  if (!process.env.FACEBOOK_CALLBACK_URL.includes('/facebook/callback')) {
    console.log('⚠️  Warning: FACEBOOK_CALLBACK_URL should contain /facebook/callback');
  }
}

console.log('\n─────────────────────────────────────\n');

if (hasErrors) {
  console.log('❌ OAuth configuration has errors!');
  console.log('\n📝 Next steps:');
  console.log('   1. Copy .env.example to .env if you haven\'t');
  console.log('   2. Add your OAuth credentials to .env');
  console.log('   3. Follow OAUTH_SETUP.md for detailed instructions\n');
  process.exit(1);
} else {
  console.log('✅ OAuth configuration looks good!');
  console.log('\n📝 Make sure:');
  console.log('   1. These credentials match your Google Cloud Console');
  console.log('   2. The callback URLs are added to your OAuth app settings');
  console.log('   3. You\'ve restarted your server after adding credentials\n');
  process.exit(0);
}
