// scripts/geocode-existing-data.js
// Script to add coordinates to existing businesses and markets

const connectDB = require('../config/database.js')
const LocoBiz = require('../models/LocoBiz.js')
const HostFMarket = require('../models/HostFMarket.js')

async function geocodeZipcode(zipcode) {
  try {
    const response = await fetch(`https://zipapi.co/api/${zipcode}`)

    if (!response.ok) {
      throw new Error('Geocoding service unavailable')
    }

    const data = await response.json()

    if (data.latitude && data.longitude) {
      return {
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
      }
    }

    throw new Error('Invalid zipcode data received')
  } catch (error) {
    console.error(`Geocoding failed for ${zipcode}:`, error.message)
    return null
  }
}

async function geocodeBusinesses() {
  try {
    await connectDB()
    console.log('Connected to database')

    const businesses = await LocoBiz.find({
      locobiz_active: true,
      'locobiz_address.zipcode': { $exists: true, $ne: null, $ne: '' },
    })

    console.log(`Found ${businesses.length} businesses to geocode`)

    let updated = 0
    let failed = 0

    for (const business of businesses) {
      const zipcode = business.locobiz_address.zipcode

      // Skip if already has coordinates
      if (
        business.locobiz_address.coordinates?.latitude &&
        business.locobiz_address.coordinates?.longitude
      ) {
        continue
      }

      console.log(`Geocoding business: ${business.locobiz_name} (${zipcode})`)

      const coords = await geocodeZipcode(zipcode)

      if (coords) {
        await LocoBiz.findByIdAndUpdate(business._id, {
          'locobiz_address.coordinates': coords,
        })
        updated++
        console.log(`✓ Updated ${business.locobiz_name}`)
      } else {
        failed++
        console.log(`✗ Failed to geocode ${business.locobiz_name}`)
      }

      // Rate limiting - wait 1 second between requests
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    console.log(`\nBusiness geocoding complete:`)
    console.log(`- Updated: ${updated}`)
    console.log(`- Failed: ${failed}`)
  } catch (error) {
    console.error('Business geocoding failed:', error)
  }
}

async function geocodeMarkets() {
  try {
    const markets = await HostFMarket.find({
      hostfm_active: true,
      'address.zipcode': { $exists: true, $ne: null, $ne: '' },
    })

    console.log(`Found ${markets.length} markets to geocode`)

    let updated = 0
    let failed = 0

    for (const market of markets) {
      const zipcode = market.address.zipcode

      // Skip if already has coordinates
      if (
        market.address.coordinates?.latitude &&
        market.address.coordinates?.longitude
      ) {
        continue
      }

      console.log(`Geocoding market: ${market.hostfm_name} (${zipcode})`)

      const coords = await geocodeZipcode(zipcode)

      if (coords) {
        await HostFMarket.findByIdAndUpdate(market._id, {
          'address.coordinates': coords,
        })
        updated++
        console.log(`✓ Updated ${market.hostfm_name}`)
      } else {
        failed++
        console.log(`✗ Failed to geocode ${market.hostfm_name}`)
      }

      // Rate limiting - wait 1 second between requests
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    console.log(`\nMarket geocoding complete:`)
    console.log(`- Updated: ${updated}`)
    console.log(`- Failed: ${failed}`)
  } catch (error) {
    console.error('Market geocoding failed:', error)
  }
}

async function main() {
  console.log('Starting geocoding process...')

  await geocodeBusinesses()
  await geocodeMarkets()

  console.log('\nGeocoding process complete!')
  process.exit(0)
}

// Run the geocoding
main().catch((error) => {
  console.error('Geocoding process failed:', error)
  process.exit(1)
})
