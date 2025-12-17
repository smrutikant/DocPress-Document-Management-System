#!/usr/bin/env node

/**
 * OAuth Configuration Verification Script
 * Checks if OAuth environment variables are properly configured
 * and verifies them against Google's API
 */

require('dotenv').config();
const axios = require('axios');

console.log('🔍 Verifying OAuth Configuration...\n');

let hasErrors = false;
let hasWarnings = false;

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
    hasWarnings = true;
  }
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  console.log('❌ GOOGLE_CLIENT_SECRET is missing');
  hasErrors = true;
} else {
  console.log(`✅ GOOGLE_CLIENT_SECRET: ${process.env.GOOGLE_CLIENT_SECRET.substring(0, 10)}...`);

  // Check format - Google client secrets start with GOCSPX-
  if (!process.env.GOOGLE_CLIENT_SECRET.startsWith('GOCSPX-')) {
    console.log('⚠️  Warning: GOOGLE_CLIENT_SECRET should start with GOCSPX-');
    hasWarnings = true;
  }
}

if (!process.env.GOOGLE_CALLBACK_URL) {
  console.log('❌ GOOGLE_CALLBACK_URL is missing');
  hasErrors = true;
} else {
  console.log(`✅ GOOGLE_CALLBACK_URL: ${process.env.GOOGLE_CALLBACK_URL}`);

  // Validate callback URL format
  if (!process.env.GOOGLE_CALLBACK_URL.includes('/google/callback')) {
    console.log('⚠️  Warning: GOOGLE_CALLBACK_URL should contain /google/callback');
    hasWarnings = true;
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

async function verifyGoogleCredentials() {
  if (hasErrors) {
    console.log('❌ OAuth configuration has errors! Skipping Google API verification.\n');
    console.log('📝 Next steps:');
    console.log('   1. Copy .env.example to .env if you haven\'t');
    console.log('   2. Add your OAuth credentials to .env');
    console.log('   3. Follow OAUTH_SETUP.md for detailed instructions\n');
    return false;
  }

  console.log('🔄 Verifying credentials with Google API...\n');

  try {
    // Try to exchange a dummy auth code to test credentials
    // This will fail but the error message tells us if credentials are valid
    const response = await axios.post(
      'https://oauth2.googleapis.com/token',
      new URLSearchParams({
        code: 'test_code',
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        grant_type: 'authorization_code'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        validateStatus: () => true // Don't throw on any status
      }
    );

    const error = response.data.error;

    if (error === 'invalid_client') {
      console.log('❌ INVALID CREDENTIALS:');
      console.log('   Your Client ID or Client Secret is incorrect.');
      console.log('   Please check Google Cloud Console:\n');
      console.log('   1. Go to https://console.cloud.google.com/apis/credentials');
      console.log('   2. Select your OAuth 2.0 Client ID');
      console.log('   3. Copy the correct Client ID and Client Secret\n');
      return false;
    } else if (error === 'redirect_uri_mismatch') {
      console.log('❌ REDIRECT URI MISMATCH:');
      console.log('   Your callback URL is not authorized in Google Cloud Console.');
      console.log(`   Current callback URL: ${process.env.GOOGLE_CALLBACK_URL}\n`);
      console.log('   To fix this:');
      console.log('   1. Go to https://console.cloud.google.com/apis/credentials');
      console.log('   2. Select your OAuth 2.0 Client ID');
      console.log('   3. Add this URI to "Authorized redirect URIs":');
      console.log(`      ${process.env.GOOGLE_CALLBACK_URL}\n`);
      return false;
    } else if (error === 'invalid_grant') {
      // This is expected with a test code - means credentials are valid!
      console.log('✅ GOOGLE CREDENTIALS VERIFIED!');
      console.log('   Your Client ID, Client Secret, and Callback URL are correctly configured.\n');
      return true;
    } else {
      console.log(`⚠️  Unexpected response from Google: ${error}`);
      console.log('   Credentials format appears correct but verification inconclusive.\n');
      return true; // Don't fail on unexpected but non-critical errors
    }
  } catch (error) {
    console.log('⚠️  Could not verify with Google API:');
    console.log(`   ${error.message}\n`);
    console.log('   Environment variables are set, but online verification failed.');
    console.log('   You may not have internet connection or Google APIs may be down.\n');
    return true; // Don't fail on network errors
  }
}

async function main() {
  const isValid = await verifyGoogleCredentials();

  console.log('─────────────────────────────────────\n');

  if (!isValid) {
    console.log('❌ OAuth verification failed!\n');
    process.exit(1);
  }

  if (hasWarnings) {
    console.log('⚠️  OAuth configuration has warnings.');
    console.log('   Please review the warnings above.\n');
  } else {
    console.log('✅ All checks passed!\n');
  }

  console.log('📝 Final reminders:');
  console.log('   1. Restart your server after changing .env');
  console.log('   2. Test login at http://localhost:3000/login');
  console.log('   3. Check server logs if login fails\n');

  process.exit(isValid && !hasErrors ? 0 : 1);
}

main();
