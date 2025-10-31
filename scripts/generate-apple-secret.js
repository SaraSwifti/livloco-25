// scripts/generate-apple-secret.js
// Run this once to generate your Apple client secret
// Usage: node scripts/generate-apple-secret.js
//
// This script will automatically load variables from your .env file
// Make sure to set these in your .env file first:
// - APPLE_TEAM_ID (from Apple Developer Portal → Membership)
// - APPLE_ID (your Services ID, e.g., com.yourdomain.livloco)
// - APPLE_KEY_ID (from the Key you created)
// - APPLE_KEY_FILE_PATH (path to your downloaded .p8 file)

// Load environment variables from .env file
require('dotenv').config({ path: '.env' })

const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

const teamId = process.env.APPLE_TEAM_ID // Your Apple Team ID
const clientId = process.env.APPLE_ID // Your Services ID
const keyId = process.env.APPLE_KEY_ID // Your Key ID
const keyFilePath = process.env.APPLE_KEY_FILE_PATH // Path to your .p8 file

// Validate required environment variables
if (!teamId) {
  console.error('❌ Error: APPLE_TEAM_ID is required')
  console.log('   Set it in your .env file or export it:')
  console.log('   export APPLE_TEAM_ID=ABC123DEF4')
  process.exit(1)
}

if (!clientId) {
  console.error('❌ Error: APPLE_ID is required')
  console.log('   Set it in your .env file or export it:')
  console.log('   export APPLE_ID=com.yourdomain.livloco')
  process.exit(1)
}

if (!keyId) {
  console.error('❌ Error: APPLE_KEY_ID is required')
  console.log('   Set it in your .env file or export it:')
  console.log('   export APPLE_KEY_ID=XYZ789ABC1')
  process.exit(1)
}

if (!keyFilePath) {
  console.error('❌ Error: APPLE_KEY_FILE_PATH is required')
  console.log('   Set it in your .env file or export it:')
  console.log('   export APPLE_KEY_FILE_PATH=/path/to/AuthKey_XYZ789ABC1.p8')
  console.log(
    '   Or use relative path: export APPLE_KEY_FILE_PATH=./path/to/key.p8'
  )
  process.exit(1)
}

// Check if key file exists
if (!fs.existsSync(keyFilePath)) {
  console.error(`❌ Error: Key file not found at: ${keyFilePath}`)
  console.log('   Make sure the path is correct and the file exists.')
  process.exit(1)
}

try {
  // Read the private key file
  const privateKey = fs.readFileSync(keyFilePath, 'utf8')

  // Create the JWT
  const token = jwt.sign(
    {
      iss: teamId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400 * 180, // 6 months
      aud: 'https://appleid.apple.com',
      sub: clientId,
    },
    privateKey,
    {
      algorithm: 'ES256',
      keyid: keyId,
    }
  )

  console.log('\n✅ Apple Client Secret Generated Successfully!')
  console.log('\n' + '='.repeat(60))
  console.log('Copy this value and add it to your .env file:')
  console.log('='.repeat(60))
  console.log('\nAPPLE_SECRET=' + token + '\n')
  console.log('='.repeat(60))
  console.log(
    "\n⚠️  Note: This token expires in 6 months. You'll need to regenerate it."
  )
  console.log('\n✅ Done! Add APPLE_SECRET to your .env file.\n')
} catch (error) {
  console.error('❌ Error generating JWT:', error.message)
  if (error.message.includes('EC')) {
    console.error(
      '   This might be a key format issue. Make sure your .p8 file is correct.'
    )
  }
  process.exit(1)
}
