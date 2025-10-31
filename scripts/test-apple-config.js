// scripts/test-apple-config.js
// Comprehensive Apple Sign In configuration test

require('dotenv').config({ path: '.env' })

console.log('🔍 Apple Sign In Configuration Test\n')
console.log('='.repeat(60))

// Test 1: Required Environment Variables
console.log('\n1. Environment Variables Check:')
console.log('-'.repeat(60))

const requiredVars = {
  APPLE_ID: process.env.APPLE_ID,
  APPLE_SECRET: process.env.APPLE_SECRET ? '✅ Set' : '❌ Missing',
}

let allGood = true

for (const [key, value] of Object.entries(requiredVars)) {
  if (value === '❌ Missing') {
    console.log(`❌ ${key}: ${value}`)
    allGood = false
  } else {
    console.log(`✅ ${key}: ${value}`)
  }
}

// Test 2: Verify Services ID format
console.log('\n2. Services ID Format Check:')
console.log('-'.repeat(60))
if (process.env.APPLE_ID) {
  const servicesId = process.env.APPLE_ID
  console.log(`   Services ID: ${servicesId}`)

  // Check format
  if (!servicesId.includes('.')) {
    console.log(
      '   ⚠️  Warning: Services ID should use reverse domain notation (e.g., com.domain.app)'
    )
  } else {
    console.log('   ✅ Format looks correct (reverse domain notation)')
  }

  // Common issues
  if (servicesId.includes(' ')) {
    console.log('   ❌ ERROR: Services ID contains spaces - remove them!')
    allGood = false
  }
  if (servicesId !== servicesId.trim()) {
    console.log('   ❌ ERROR: Services ID has leading/trailing whitespace')
    allGood = false
  }
}

// Test 3: Determine callback URL
console.log('\n3. Expected Callback URLs:')
console.log('-'.repeat(60))
console.log('   Apple requires these exact URLs in Developer Portal:')
console.log('')
console.log('   For LOCAL DEVELOPMENT:')
console.log('   → http://localhost:3000/api/auth/callback/apple')
console.log("   (or whatever port you're using)")
console.log('')
console.log('   For PRODUCTION:')
console.log('   → https://yourdomain.com/api/auth/callback/apple')
console.log('   (replace "yourdomain.com" with your actual domain)')

// Test 4: Check NextAuth configuration
console.log('\n4. NextAuth Configuration:')
console.log('-'.repeat(60))

const nextAuthUrl = process.env.NEXTAUTH_URL
if (nextAuthUrl) {
  console.log(`   ✅ NEXTAUTH_URL: ${nextAuthUrl}`)
  console.log(
    `   → Callback URL will be: ${nextAuthUrl}/api/auth/callback/apple`
  )
} else {
  console.log('   ⚠️  NEXTAUTH_URL not set')
  console.log('   → For localhost, NextAuth will use: http://localhost:3000')
  console.log(
    '   → Make sure Apple Developer Portal has: http://localhost:3000/api/auth/callback/apple'
  )
}

// Final recommendations
console.log('\n5. Action Items to Fix "Invalid Client" Error:')
console.log('='.repeat(60))

if (!allGood) {
  console.log('❌ Fix the errors above first!')
} else {
  console.log(
    '✅ Environment variables look good. Check these in Apple Developer Portal:'
  )
}

console.log('\n📋 Step-by-Step Fix:')
console.log('')
console.log(
  '1. Go to Apple Developer Portal → Certificates, Identifiers & Profiles'
)
console.log('2. Click on "Identifiers" → Find your Services ID')
console.log('3. Click on your Services ID (the one matching APPLE_ID)')
console.log('4. Verify "Sign in with Apple" is CHECKED')
console.log('5. Click "Configure" next to "Sign in with Apple"')
console.log('6. In "Website URLs" section, check "Return URLs" contains:')
console.log('')
if (nextAuthUrl) {
  console.log(`   ${nextAuthUrl}/api/auth/callback/apple`)
} else {
  console.log('   http://localhost:3000/api/auth/callback/apple')
  console.log('   (or your production domain URL)')
}
console.log('')
console.log('7. Also check:')
console.log('   - Domains and Subdomains includes your domain')
console.log('   - Primary App ID is selected')
console.log('')
console.log('8. Click "Save" and "Continue"')
console.log('')
console.log('9. Restart your development server:')
console.log('   npm run dev')
console.log('')

// Check if they might be using wrong Services ID
console.log('\n⚠️  Common Mistake:')
console.log('-'.repeat(60))
console.log('Make sure APPLE_ID is your SERVICES ID (from Step 1),')
console.log('NOT your App ID (from Step 2).')
console.log('')
console.log('Services ID example: com.yourdomain.livloco')
console.log('App ID example:      com.yourdomain.livloco.app')
console.log('')

if (process.env.APPLE_ID?.includes('.app')) {
  console.log('⚠️  WARNING: Your APPLE_ID ends with ".app"')
  console.log('   This might be your App ID, not Services ID!')
  console.log('   Services IDs typically do NOT have ".app" at the end')
  console.log('   Double-check in Apple Developer Portal')
}
