import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import LocoBiz from '@/models/LocoBiz'

// Manual coordinates for common zipcodes
const ZIPCODE_COORDINATES = {
  49331: { latitude: 42.9336, longitude: -85.3419 }, // Lowell, MI
  48726: { latitude: 43.1817, longitude: -85.2558 }, // Alto, MI
  10012: { latitude: 40.7282, longitude: -73.9942 }, // New York, NY
  12345: { latitude: 28.5383, longitude: -81.3792 }, // Florida (general)
  45678: { latitude: 39.1031, longitude: -84.512 }, // Ohio (general)
  78910: { latitude: 30.2672, longitude: -97.7431 }, // Texas (general)
}

export async function POST() {
  try {
    await connectDB()
    console.log('Connected to database')

    let updated = 0
    let skipped = 0

    // Update businesses with known zipcodes
    for (const [zipcode, coords] of Object.entries(ZIPCODE_COORDINATES)) {
      const businesses = await LocoBiz.find({
        locobiz_active: true,
        'locobiz_address.zipcode': zipcode,
        'locobiz_address.coordinates': { $exists: false },
      })

      for (const business of businesses) {
        await LocoBiz.findByIdAndUpdate(business._id, {
          'locobiz_address.coordinates': coords,
        })
        updated++
        console.log(`✓ Updated ${business.locobiz_name} (${zipcode})`)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Manual geocoding complete',
      results: {
        updated,
        skipped,
      },
    })
  } catch (error) {
    console.error('Manual geocoding failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Manual geocoding failed',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
