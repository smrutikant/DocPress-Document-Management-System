# OAuth Setup Guide

This guide explains how to set up Google and Facebook OAuth authentication for DocPress.

## Prerequisites

- A DocPress installation
- Access to Google Cloud Console (for Google OAuth)
- Access to Meta for Developers (for Facebook OAuth)

## Google OAuth Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"

### 2. Configure OAuth Consent Screen

1. Click "OAuth consent screen" in the left sidebar
2. Choose "External" user type (or "Internal" for workspace users only)
3. Fill in the required information:
   - App name: `DocPress`
   - User support email: Your email
   - Developer contact email: Your email
4. Add scopes:
   - `userinfo.email`
   - `userinfo.profile`
   - `openid`
5. Add test users if in testing mode
6. Save and continue

### 3. Create OAuth 2.0 Client ID

1. Go to "Credentials" tab
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application"
4. Configure:
   - Name: `DocPress Web Client`
   - Authorized JavaScript origins: `http://localhost:3000` (add production URL later)
   - Authorized redirect URIs: `http://localhost:3000/google/callback`
5. Click "Create"
6. Copy the **Client ID** and **Client Secret**

### 4. Update Environment Variables

Add to your `.env` file:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/google/callback
```

## Facebook OAuth Setup

### 1. Create a Facebook App

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click "My Apps" > "Create App"
3. Choose "Consumer" as app type
4. Fill in app details:
   - App name: `DocPress`
   - Contact email: Your email
5. Click "Create App"

### 2. Add Facebook Login

1. In your app dashboard, find "Facebook Login"
2. Click "Set Up"
3. Choose "Web" platform
4. Enter your site URL: `http://localhost:3000`

### 3. Configure OAuth Settings

1. Go to "Facebook Login" > "Settings"
2. Add to "Valid OAuth Redirect URIs":
   - `http://localhost:3000/facebook/callback`
3. Save changes

### 4. Get App Credentials

1. Go to "Settings" > "Basic"
2. Copy the **App ID** and **App Secret**

### 5. Update Environment Variables

Add to your `.env` file:

```env
FACEBOOK_APP_ID=your-app-id
FACEBOOK_APP_SECRET=your-app-secret
FACEBOOK_CALLBACK_URL=http://localhost:3000/facebook/callback
```

## Database Migration

Run the database migration to add OAuth fields to the User model:

```bash
# For development, you may need to drop and recreate tables
npm run reset-db

# Or manually add columns if you have existing data:
# ALTER TABLE users ALTER COLUMN password DROP NOT NULL;
# ALTER TABLE users ADD COLUMN provider VARCHAR(20) DEFAULT 'local';
# ALTER TABLE users ADD COLUMN provider_id VARCHAR(255);
# ALTER TABLE users ADD COLUMN profile_picture VARCHAR(500);
```

## Testing

1. Start your application:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/login`

3. Click "Continue with Google" or "Continue with Facebook"

4. Complete the OAuth flow

5. You should be redirected back to your app and logged in

## Production Deployment

### For Google OAuth:

1. Add your production domain to:
   - Authorized JavaScript origins: `https://yourdomain.com`
   - Authorized redirect URIs: `https://yourdomain.com/google/callback`

2. Update your `.env`:
   ```env
   GOOGLE_CALLBACK_URL=https://yourdomain.com/google/callback
   ```

3. Submit your app for verification if you need more than 100 users

### For Facebook OAuth:

1. Go to "Settings" > "Basic"
2. Add your production domain to "App Domains"
3. Add production callback URL to OAuth redirect URIs

4. Update your `.env`:
   ```env
   FACEBOOK_CALLBACK_URL=https://yourdomain.com/facebook/callback
   ```

5. Switch app from "Development" to "Live" mode in dashboard

## Troubleshooting

### Google OAuth Issues

- **"redirect_uri_mismatch" error**: Ensure the callback URL in `.env` exactly matches the one in Google Console
- **"invalid_client" error**: Check that your Client ID and Secret are correct
- **Consent screen error**: Make sure you've published your OAuth consent screen

### Facebook OAuth Issues

- **"App Not Setup"**: Ensure Facebook Login is added and configured
- **"redirect_uri" error**: Verify the callback URL matches in both Facebook settings and `.env`
- **Email not provided**: Facebook requires users to grant email permission; if denied, authentication will fail

### General Issues

- **Session not persisting**: Check that `SESSION_SECRET` is set in `.env`
- **Database errors**: Ensure the User model migration has been applied
- **Axios errors**: Check your internet connection and OAuth provider status

## Security Notes

1. **Never commit** `.env` file to version control
2. Keep OAuth secrets secure
3. Use HTTPS in production
4. Regularly rotate secrets
5. Monitor OAuth app dashboards for unusual activity
6. Implement rate limiting for OAuth endpoints

## Features

- Users can sign up/login with Google or Facebook
- OAuth users don't need passwords
- Profile pictures are automatically synced
- Existing users can link their OAuth accounts
- Supports both local and OAuth authentication simultaneously
