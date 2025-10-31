// scripts/check-apple-config.js
// Run this to verify your Apple configuration

// Load environment variables from .env file
require('dotenv').config({ path: '.env' })

console.log('🔍 Checking Apple Sign In Configuration...\n')

const checks = {
  APPLE_ID: process.env.APPLE_ID,
  APPLE_SECRET: process.env.APPLE_SECRET ? '✅ Set (hidden)' : '❌ Missing',
  APPLE_TEAM_ID: process.env.APPLE_TEAM_ID,
  APPLE_KEY_ID: process.env.APPLE_KEY_ID,
  APPLE_PRIVATE_KEY: process.env.APPLE_PRIVATE_KEY
    ? '✅ Set (hidden)'
    : '❌ Missing',
}

console.log('Environment Variables:')
console.log('='.repeat(50))
for (const [key, value] of Object.entries(checks)) {
  if (value === '✅ Set (hidden)' || value === '❌ Missing') {
    console.log(`${key}: ${value}`)
  } else {
    console.log(`${key}: ${value || '❌ Missing'}`)
  }
}
console.log('='.repeat(50))

// Validation
const issues = []

if (!process.env.APPLE_ID) {
  issues.push('❌ APPLE_ID is not set')
  console.log('\n⚠️  Issue: APPLE_ID is required')
  console.log(
    '   This should be your Services ID (e.g., com.yourdomain.livloco)'
  )
} else {
  console.log(`\n✅ APPLE_ID is set: ${process.env.APPLE_ID}`)
  console.log(
    '   Verify this matches your Services ID in Apple Developer Portal'
  )
}

if (!process.env.APPLE_SECRET && !process.env.APPLE_TEAM_ID) {
  issues.push(
    '❌ APPLE_SECRET or APPLE_TEAM_ID/APPLE_KEY_ID/APPLE_PRIVATE_KEY are not set'
  )
  console.log('\n⚠️  Issue: You need either:')
  console.log('   - APPLE_SECRET (pre-generated JWT), OR')
  console.log('   - APPLE_TEAM_ID + APPLE_KEY_ID + APPLE_PRIVATE_KEY')
} else if (process.env.APPLE_SECRET) {
  console.log('\n✅ APPLE_SECRET is set')
} else if (
  process.env.APPLE_TEAM_ID &&
  process.env.APPLE_KEY_ID &&
  process.env.APPLE_PRIVATE_KEY
) {
  console.log(
    '\n✅ Using APPLE_TEAM_ID/APPLE_KEY_ID/APPLE_PRIVATE_KEY configuration'
  )
} else {
  issues.push('❌ Incomplete Apple configuration')
  console.log('\n⚠️  Issue: If not using APPLE_SECRET, you need all three:')
  console.log('   - APPLE_TEAM_ID')
  console.log('   - APPLE_KEY_ID')
  console.log('   - APPLE_PRIVATE_KEY')
}

console.log('\n📋 Next Steps to Fix "Invalid Client" Error:')
console.log('='.repeat(50))
console.log(
  '1. Verify APPLE_ID matches your Services ID exactly in Apple Developer Portal'
)
console.log('   - Go to Certificates, Identifiers & Profiles → Identifiers')
console.log('   - Find your Services ID')
console.log('   - Make sure the identifier matches exactly (case-sensitive)')
console.log('\n2. Verify Sign In with Apple is enabled on your Services ID')
console.log('   - Click on your Services ID')
console.log('   - Check "Sign in with Apple" is enabled')
console.log('   - Click Configure and verify Primary App ID is set')
console.log('\n3. Verify the Return URL is configured correctly')
console.log('   - In Services ID → Sign in with Apple → Configure')
console.log('   - Website URLs → Return URLs should be:')
console.log('     https://yourdomain.com/api/auth/callback/apple')
console.log('   - OR for local dev:')
console.log('     http://localhost:3000/api/auth/callback/apple')
console.log(
  '\n4. Make sure your APPLE_SECRET is valid (if using pre-generated JWT)'
)
console.log('   - Regenerate it if it might be expired (> 6 months old)')
console.log('   - Use: node scripts/generate-apple-secret.js')

if (issues.length > 0) {
  console.log('\n❌ Found Issues:')
  issues.forEach((issue) => console.log(`   ${issue}`))
  process.exit(1)
} else {
  console.log('\n✅ Basic configuration looks good!')
  console.log('   If you still get "invalid client", check the steps above.')
}
