#!/usr/bin/env node

/**
 * Google OAuth Test Script
 * Tests if your Google OAuth credentials work
 */

require('dotenv').config();
const axios = require('axios');

async function testGoogleOAuth() {
  console.log('🧪 Testing Google OAuth Configuration...\n');

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackUrl = process.env.GOOGLE_CALLBACK_URL;

  console.log('Configuration:');
  console.log('─────────────────────────────────────');
  console.log('Client ID:', clientId?.substring(0, 30) + '...');
  console.log('Client Secret:', clientSecret?.substring(0, 15) + '...');
  console.log('Callback URL:', callbackUrl);
  console.log('─────────────────────────────────────\n');

  // Test 1: Check if credentials exist
  if (!clientId || !clientSecret || !callbackUrl) {
    console.log('❌ Missing credentials in .env file\n');
    return;
  }

  console.log('✅ All credentials are present\n');

  // Test 2: Validate Client ID format
  if (!clientId.endsWith('.apps.googleusercontent.com')) {
    console.log('⚠️  Warning: Client ID format looks incorrect');
    console.log('   Should end with: .apps.googleusercontent.com\n');
  } else {
    console.log('✅ Client ID format looks correct\n');
  }

  // Test 3: Validate Client Secret format
  if (!clientSecret.startsWith('GOCSPX-')) {
    console.log('⚠️  Warning: Client Secret format looks incorrect');
    console.log('   Should start with: GOCSPX-\n');
  } else {
    console.log('✅ Client Secret format looks correct\n');
  }

  // Test 4: Check callback URL format
  if (!callbackUrl.includes('/google/callback')) {
    console.log('❌ Callback URL must include /google/callback\n');
  } else {
    console.log('✅ Callback URL format looks correct\n');
  }

  console.log('📋 Next Steps:');
  console.log('─────────────────────────────────────');
  console.log('1. Go to: https://console.cloud.google.com/apis/credentials');
  console.log('2. Click your OAuth 2.0 Client ID');
  console.log('3. Verify "Authorized redirect URIs" includes:');
  console.log('   ' + callbackUrl);
  console.log('4. Make sure there are NO extra spaces or trailing slashes');
  console.log('5. Save and wait 5-10 minutes for changes to propagate');
  console.log('6. Restart your Node.js server\n');

  console.log('🔍 Common Issues:');
  console.log('─────────────────────────────────────');
  console.log('• Redirect URI mismatch (must be EXACT match)');
  console.log('• Using wrong OAuth client (API key vs OAuth 2.0)');
  console.log('• OAuth consent screen not configured');
  console.log('• Server not restarted after .env changes');
  console.log('• Browser cache (try incognito mode)');
  console.log('─────────────────────────────────────\n');
}

testGoogleOAuth().catch(console.error);
