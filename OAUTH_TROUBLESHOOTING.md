# OAuth Troubleshooting Guide

## Error: 401 invalid_client

This is the most common OAuth error. Here's how to fix it:

### Step 1: Verify Your Environment Variables

Run the verification script:
```bash
node scripts/verify-oauth.js
```

### Step 2: Check Your .env File Format

Your `.env` file should look **exactly** like this (with your actual credentials):

```env
# Google OAuth - NO QUOTES, NO SPACES
GOOGLE_CLIENT_ID=123456789-abcdefghijk.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3000/google/callback

# Facebook OAuth - NO QUOTES, NO SPACES
FACEBOOK_APP_ID=1234567890123456
FACEBOOK_APP_SECRET=your_secret_here
FACEBOOK_CALLBACK_URL=http://localhost:3000/facebook/callback
```

**Common Mistakes:**
- ❌ Using quotes: `GOOGLE_CLIENT_ID="abc123"`
- ✅ No quotes: `GOOGLE_CLIENT_ID=abc123`
- ❌ Spaces around =: `GOOGLE_CLIENT_ID = abc123`
- ✅ No spaces: `GOOGLE_CLIENT_ID=abc123`
- ❌ Extra whitespace or newlines

### Step 3: Verify Google Cloud Console Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" > "Credentials"
4. Click on your OAuth 2.0 Client ID
5. Check these settings:

**Authorized JavaScript origins:**
```
http://localhost:3000
```

**Authorized redirect URIs:**
```
http://localhost:3000/google/callback
```

⚠️ **IMPORTANT:** The redirect URI must EXACTLY match your `.env`:
- Same protocol (http vs https)
- Same domain
- Same port
- Same path
- NO trailing slash

### Step 4: Check Client ID Format

Your Google Client ID should:
- End with `.apps.googleusercontent.com`
- Look like: `123456789-abc123xyz.apps.googleusercontent.com`

If it doesn't, you might be using the wrong credential type. Make sure you're using an **OAuth 2.0 Client ID**, not an API Key or Service Account.

### Step 5: Restart Your Server

After changing `.env`, you MUST restart your Node.js server:

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### Step 6: Clear Browser Cache

Sometimes browsers cache OAuth redirects:
1. Open DevTools (F12)
2. Right-click the refresh button
3. Choose "Empty Cache and Hard Reload"

Or use Incognito/Private mode for testing.

### Step 7: Test the OAuth Flow

1. Navigate to: `http://localhost:3000/login`
2. Click "Continue with Google"
3. Check your browser's developer console (F12) for any errors
4. Check your server terminal for error messages

## Other Common Errors

### Error: redirect_uri_mismatch

**Problem:** The callback URL doesn't match Google Console settings

**Solution:**
1. Check your `.env` GOOGLE_CALLBACK_URL
2. Check Google Console redirect URIs
3. Make sure they are IDENTICAL (including http/https, port, trailing slash)

Example:
```
.env:                http://localhost:3000/google/callback
Google Console:      http://localhost:3000/google/callback
```

### Error: access_denied

**Problem:** User clicked "Cancel" or denied permissions

**Solution:** This is expected behavior. Try again and click "Allow"

### Error: invalid_grant

**Problem:** Authorization code has expired or been used already

**Solution:**
1. Clear your browser cookies
2. Try the login flow again
3. Don't refresh the callback page

### Error: "App Not Verified" Warning

**Problem:** Google shows a warning about unverified app

**Solution:**
1. For development: Click "Advanced" > "Go to [App Name] (unsafe)"
2. For production: Submit your app for verification

## Debugging Tips

### 1. Enable Debug Logging

Add this to your authController.js temporarily:

```javascript
exports.googleCallback = async (req, res) => {
  try {
    console.log('=== Google Callback Debug ===');
    console.log('Code:', req.query.code?.substring(0, 20) + '...');
    console.log('Client ID:', process.env.GOOGLE_CLIENT_ID);
    console.log('Callback URL:', process.env.GOOGLE_CALLBACK_URL);
    console.log('============================');

    // ... rest of code
  }
}
```

### 2. Test Environment Variables

Create a test file `test-env.js`:

```javascript
require('dotenv').config();

console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID);
console.log('Google Client Secret:', process.env.GOOGLE_CLIENT_SECRET?.substring(0, 10) + '...');
console.log('Google Callback:', process.env.GOOGLE_CALLBACK_URL);
```

Run it:
```bash
node test-env.js
```

### 3. Check Request/Response

Add this to see the exact error:

```javascript
} catch (error) {
  console.error('Full error:', JSON.stringify(error.response?.data, null, 2));
  // ... rest of error handling
}
```

## Production Checklist

Before deploying to production:

- [ ] Update callback URLs to production domain (https://yourdomain.com)
- [ ] Add production URLs to Google Console
- [ ] Update .env with production URLs
- [ ] Test OAuth flow on production
- [ ] Enable HTTPS (required for production)
- [ ] Submit app for Google verification if needed

## Quick Reference

### Google Console URL
https://console.cloud.google.com/apis/credentials

### Where to Find Client ID
1. Google Cloud Console
2. APIs & Services
3. Credentials
4. Click your OAuth 2.0 Client ID
5. Copy "Client ID" and "Client secret"

### Where to Set Redirect URIs
1. Same page as above
2. Scroll to "Authorized redirect URIs"
3. Click "ADD URI"
4. Enter: `http://localhost:3000/google/callback`
5. Click "SAVE"

## Still Having Issues?

1. Run the verification script: `node scripts/verify-oauth.js`
2. Check server logs for detailed error messages
3. Verify your Google Cloud project is active
4. Make sure OAuth consent screen is configured
5. Try creating a new OAuth client ID
6. Ensure your Google account has permission to create OAuth clients

## Support

If you're still stuck:
1. Check the full error in server logs
2. Verify all environment variables are set
3. Make sure you've restarted the server
4. Try in incognito mode
5. Check OAUTH_SETUP.md for initial setup steps
