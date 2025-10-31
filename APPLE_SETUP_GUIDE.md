# Apple Sign In Setup Guide

This guide will help you set up Apple Sign In for LivLoco Co-op.

## Prerequisites

1. **Apple Developer Account** ($99/year)
   - Sign up at https://developer.apple.com/
   - Wait for approval (usually 24-48 hours)

## Step-by-Step Setup

### Step 1: Create a Services ID

1. Log into [Apple Developer Portal](https://developer.apple.com/account/)
2. Navigate to **Certificates, Identifiers & Profiles** → **Identifiers**
3. Click the **+** button to create a new identifier
4. Select **Services IDs** and click **Continue**
5. Fill in:
   - **Description**: `LivLoco Co-op Sign In`
   - **Identifier**: `com.yourdomain.livloco` (use reverse domain notation)
6. Click **Continue** and **Register**

### Step 2: Create an App ID (If you don't have one)

**Skip this step if you already have an App ID. Otherwise:**

1. In **Certificates, Identifiers & Profiles** → **Identifiers**
2. Click the **+** button
3. Select **App IDs** and click **Continue**
4. Select **App** (not App Clip, watchOS App, etc.)
5. Fill in:
   - **Description**: `LivLoco Co-op App`
   - **Bundle ID**: `com.yourdomain.livloco.app` (use explicit Bundle ID)
6. Under **Capabilities**, check **Sign In with Apple** (important!)
7. Click **Continue** and **Register**
8. Now go back to Step 3 below

### Step 3: Enable Sign In with Apple on Services ID

1. Click on your newly created Services ID (from Step 1)
2. Check the box for **Sign in with Apple**
3. Click **Configure**
4. In the **Primary App ID** dropdown, select the App ID you just created
   - It should now appear: `com.yourdomain.livloco.app`
5. Under **Website URLs**:
   - **Domains and Subdomains**: `yourdomain.com` (your actual domain)
     - ⚠️ **IMPORTANT**: Apple does NOT allow `localhost` in Return URLs
     - For local development, you need to use your actual domain or a tunnel service
   - **Return URLs**:
     - For PRODUCTION: `https://yourdomain.com/api/auth/callback/apple`
     - For LOCAL DEV with ngrok: `https://your-ngrok-url.ngrok.io/api/auth/callback/apple`
     - OR use your actual domain: `https://yourdomain.com/api/auth/callback/apple`
   - Click **Save**
6. Click **Continue** and **Save**

### Step 4: Create a Key

1. Navigate to **Keys** section (in Certificates, Identifiers & Profiles)
2. Click the **+** button
3. Enter a **Key Name**: `LivLoco Sign In Key`
4. Check **Sign in with Apple**
5. Click **Configure** next to **Sign in with Apple**
6. Select your **Primary App ID** (the one you created in Step 2)
7. Click **Save**
8. Click **Continue** and **Register**
9. **DOWNLOAD THE .p8 FILE** - You can only download it once!
10. Note your **Key ID** (shown after creating the key)

### Step 5: Get Your Team ID

1. Go to **Membership** (top-right of Apple Developer Portal)
2. Your **Team ID** is shown there (format: `ABC123DEF4`)

### Step 6: Configure Environment Variables

Add to your `.env` file:

#### Option A: Using Pre-generated JWT (Recommended)

**First, set these environment variables temporarily:**

```bash
export APPLE_TEAM_ID=ABC123DEF4        # From Step 5
export APPLE_ID=com.yourdomain.livloco # From Step 1
export APPLE_KEY_ID=XYZ789ABC1         # From Step 4
export APPLE_KEY_FILE_PATH=./AuthKey_XYZ789ABC1.p8  # Path to your downloaded .p8 file
```

**Then, generate the JWT secret using the script:**

```bash
node scripts/generate-apple-secret.js
```

**Finally, add the generated secret to your `.env` file:**

```env
APPLE_ID=com.yourdomain.livloco
APPLE_SECRET=<generated-jwt-token>
```

#### Option B: Using Key Components (Alternative)

Add to `.env`:

```env
APPLE_ID=com.yourdomain.livloco
APPLE_TEAM_ID=ABC123DEF4
APPLE_KEY_ID=XYZ789ABC1
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
YOUR_PRIVATE_KEY_CONTENT_HERE
-----END PRIVATE KEY-----"
```

**Note**: For Option B, copy the entire contents of your `.p8` file including the header and footer lines.

### Step 7: Local Development Setup (Apple doesn't allow localhost)

**⚠️ CRITICAL**: Apple does NOT allow `localhost` or `127.0.0.1` in Return URLs.

For local development, you have two options:

#### Option A: Use ngrok (Recommended for Testing)

1. **Install ngrok**: Download from https://ngrok.com/ (free tier available)
2. **Start your dev server**: `npm run dev`
3. **Start ngrok tunnel**:
   ```bash
   ngrok http 3000
   ```
4. **Copy your ngrok URL** (e.g., `https://abc123.ngrok.io`)
5. **Add to Apple Developer Portal**:
   - Go to your Services ID → Configure Sign In with Apple
   - Add Return URL: `https://abc123.ngrok.io/api/auth/callback/apple`
   - Also add your production URL: `https://yourdomain.com/api/auth/callback/apple`
6. **Update NEXTAUTH_URL in .env**:
   ```env
   NEXTAUTH_URL=https://abc123.ngrok.io
   ```
7. **Restart your dev server** and use the ngrok URL to access your app

#### Option B: Use Your Production Domain

1. **Add production Return URL in Apple Developer Portal**:
   - `https://yourdomain.com/api/auth/callback/apple`
2. **Point your domain locally** (edit your hosts file or use DNS):
   - Windows: `C:\Windows\System32\drivers\etc\hosts`
   - Add: `127.0.0.1 yourdomain.com`
3. **Access via**: `https://yourdomain.com` (with local dev server)
4. **Update NEXTAUTH_URL in .env**:
   ```env
   NEXTAUTH_URL=https://yourdomain.com
   ```

### Step 8: Test

1. Restart your development server
2. Make sure NEXTAUTH_URL matches your Apple Return URL
3. Try signing in with Apple
4. Apple Sign In should work if all credentials are correct

## Troubleshooting

### "Invalid client" Error

This error means Apple doesn't recognize your Services ID. Check these:

1. **Verify APPLE_ID is set correctly in your `.env` file:**

   ```bash
   # Run this to check your configuration:
   node scripts/check-apple-config.js
   ```

2. **Check that APPLE_ID matches your Services ID exactly:**

   - Go to Apple Developer Portal → Certificates, Identifiers & Profiles → Identifiers
   - Find your Services ID (from Step 1)
   - The identifier must match **exactly** (case-sensitive, no spaces)
   - Example: If your Services ID is `com.example.livloco`, then `APPLE_ID=com.example.livloco`

3. **Verify Sign In with Apple is enabled:**

   - Click on your Services ID
   - Make sure "Sign in with Apple" checkbox is checked
   - Click "Configure" and verify:
     - Primary App ID is selected (from Step 2)
     - Website URLs are configured:
       - Domains: `yourdomain.com`
       - Return URLs: `https://yourdomain.com/api/auth/callback/apple`
       - For local dev: `http://localhost:3000/api/auth/callback/apple`

4. **Check your APPLE_SECRET:**

   - If using pre-generated JWT, make sure it's valid
   - If expired (> 6 months), regenerate it using the script
   - Make sure there are no extra spaces or line breaks in your `.env` file

5. **Restart your development server** after adding/changing environment variables:
   ```bash
   # Stop the server (Ctrl+C) and restart:
   npm run dev
   ```

### Other Common Errors

- **"Invalid redirect_uri"**: Make sure the return URL in Apple Developer Portal matches exactly: `https://yourdomain.com/api/auth/callback/apple`
- **"localhost is invalid"**: Apple does NOT allow localhost in Return URLs. Use ngrok or your actual domain for local development
- **"Invalid key"**: Ensure your private key is correctly formatted with line breaks (`\n`) if using Option B
- **Token expires**: Apple client secrets expire every 6 months. Regenerate using the script when needed.

## Important Notes

- The `.p8` file can only be downloaded once. Keep it secure!
- Apple client secrets (JWTs) expire after 6 months and need regeneration
- For production, use environment variables, never commit credentials to git
- The Return URL must match exactly (including `https://` and no trailing slash)

## Support

If you encounter issues:

1. Check Apple Developer Portal → Settings → Security → Sign in with Apple
2. Verify all environment variables are set correctly
3. Check NextAuth logs for specific error messages
