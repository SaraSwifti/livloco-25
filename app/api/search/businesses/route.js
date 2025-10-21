import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import LocoBiz from '@/models/LocoBiz'
import { calculateDistance } from '@/utils/location'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)

    // Search parameters
    const query = searchParams.get('q') || ''
    const userLat = parseFloat(searchParams.get('lat'))
    const userLon = parseFloat(searchParams.get('lon'))
    const distanceParam = searchParams.get('distance')
    const maxDistance =
      distanceParam === 'unlimited'
        ? 'unlimited'
        : parseInt(distanceParam || '50') // Default 50 miles
    const category = searchParams.get('category') || ''
    const state = searchParams.get('state') || ''
    const city = searchParams.get('city') || ''
    const zipcode = searchParams.get('zipcode') || ''
    const sortBy = searchParams.get('sort') || 'distance' // distance, name, created

    await connectDB()

    // Build MongoDB query
    let mongoQuery = { locobiz_active: true }

    // Text search across business name and description
    if (query.trim()) {
      mongoQuery.$or = [
        { locobiz_name: { $regex: query, $options: 'i' } },
        { locobiz_description: { $regex: query, $options: 'i' } },
        { 'selling.selling1.description': { $regex: query, $options: 'i' } },
        { 'selling.selling2.description': { $regex: query, $options: 'i' } },
        { 'selling.selling3.description': { $regex: query, $options: 'i' } },
        { 'needs.need1.description': { $regex: query, $options: 'i' } },
        { 'needs.need2.description': { $regex: query, $options: 'i' } },
        { 'needs.need3.description': { $regex: query, $options: 'i' } },
      ]
    }

    // Location filters
    if (state) {
      mongoQuery['locobiz_address.state_code'] = state.toUpperCase()
    }

    if (city) {
      mongoQuery['locobiz_address.city'] = { $regex: city, $options: 'i' }
    }

    if (zipcode) {
      mongoQuery['locobiz_address.zipcode'] = { $regex: zipcode }
    }

    // Execute query
    let businesses = await LocoBiz.find(mongoQuery).lean()

    // Calculate distances and filter by max distance if user location provided
    if (userLat && userLon && !isNaN(userLat) && !isNaN(userLon)) {
      businesses = await Promise.all(
        businesses.map(async (business) => {
          let lat, lon

          // Use existing coordinates if available
          if (
            business.locobiz_address?.coordinates?.latitude &&
            business.locobiz_address?.coordinates?.longitude
          ) {
            lat = business.locobiz_address.coordinates.latitude
            lon = business.locobiz_address.coordinates.longitude
          } else if (business.locobiz_address?.zipcode) {
            // Geocode on-the-fly if no coordinates
            try {
              // Try zipapi.co first
              let response = await fetch(
                `https://zipapi.co/api/${business.locobiz_address.zipcode}`
              )
              let data = null

              if (response.ok) {
                data = await response.json()
              } else {
                // Fallback to zippopotam.us
                response = await fetch(
                  `https://api.zippopotam.us/us/${business.locobiz_address.zipcode}`
                )
                if (response.ok) {
                  data = await response.json()
                  if (data.places && data.places.length > 0) {
                    const place = data.places[0]
                    data = {
                      latitude: place.latitude,
                      longitude: place.longitude,
                    }
                  }
                }
              }

              if (data && data.latitude && data.longitude) {
                lat = parseFloat(data.latitude)
                lon = parseFloat(data.longitude)

                // Save coordinates to database for future use
                await LocoBiz.findByIdAndUpdate(business._id, {
                  'locobiz_address.coordinates': {
                    latitude: lat,
                    longitude: lon,
                  },
                })
              }
            } catch (error) {
              console.error(
                `Geocoding failed for ${business.locobiz_name}:`,
                error
              )
            }
          }

          if (lat && lon) {
            const distance = calculateDistance(userLat, userLon, lat, lon)
            return { ...business, distance }
          }
          return { ...business, distance: null }
        })
      )

      // Filter by max distance (skip if unlimited)
      if (maxDistance !== 'unlimited') {
        businesses = businesses.filter(
          (business) =>
            business.distance === null || business.distance <= maxDistance
        )
      }

      // Sort by distance if available
      if (sortBy === 'distance') {
        businesses.sort((a, b) => {
          if (a.distance === null && b.distance === null) return 0
          if (a.distance === null) return 1
          if (b.distance === null) return -1
          return a.distance - b.distance
        })
      }
    }

    // Other sorting options
    if (sortBy === 'name') {
      businesses.sort((a, b) => a.locobiz_name.localeCompare(b.locobiz_name))
    } else if (sortBy === 'created') {
      businesses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    // Serialize for client
    const serializedBusinesses = JSON.parse(JSON.stringify(businesses))

    return NextResponse.json({
      success: true,
      businesses: serializedBusinesses,
      total: serializedBusinesses.length,
      filters: {
        query,
        userLat,
        userLon,
        maxDistance,
        category,
        state,
        city,
        zipcode,
        sortBy,
      },
    })
  } catch (error) {
    console.error('Business search error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search businesses',
      },
      { status: 500 }
    )
  }
}
