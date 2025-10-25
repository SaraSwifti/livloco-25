import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import HostFMarket from '@/models/HostFMarket'
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
    const state = searchParams.get('state') || ''
    const city = searchParams.get('city') || ''
    const zipcode = searchParams.get('zipcode') || ''
    const sortBy = searchParams.get('sort') || 'distance' // distance, name, created

    await connectDB()

    // Build MongoDB query
    let mongoQuery = { hostfm_active: true }

    // Text search across market name and description
    if (query.trim()) {
      mongoQuery.$or = [
        { hostfm_name: { $regex: query, $options: 'i' } },
        { hostfm_type: { $regex: query, $options: 'i' } },
      ]
    }

    // Location filters
    if (state) {
      mongoQuery['hostfm_address.state_code'] = state.toUpperCase()
    }

    if (city) {
      mongoQuery['hostfm_address.city'] = { $regex: city, $options: 'i' }
    }

    if (zipcode) {
      mongoQuery['hostfm_address.zipcode'] = { $regex: zipcode }
    }

    // Execute query
    let markets = await HostFMarket.find(mongoQuery).lean()

    // Calculate distances and filter by max distance if user location provided
    if (userLat && userLon && !isNaN(userLat) && !isNaN(userLon)) {
      markets = await Promise.all(
        markets.map(async (market) => {
          let lat, lon

          // Use existing coordinates if available
          if (
            market.hostfm_address?.coordinates?.latitude &&
            market.hostfm_address?.coordinates?.longitude
          ) {
            lat = market.hostfm_address.coordinates.latitude
            lon = market.hostfm_address.coordinates.longitude
          } else if (market.hostfm_address?.zipcode) {
            // Geocode on-the-fly if no coordinates
            try {
              let data = null

              // Try zippopotam.us first (more reliable)
              try {
                const response = await fetch(
                  `https://api.zippopotam.us/us/${market.hostfm_address.zipcode}`,
                  {
                    timeout: 5000,
                    signal: AbortSignal.timeout(5000),
                  }
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
              } catch (error) {
                console.log(
                  `Zippopotam.us failed for ${market.hostfm_name}, trying zipapi.co`
                )
              }

              // Fallback to zipapi.co if zippopotam.us failed
              if (!data || !data.latitude || !data.longitude) {
                try {
                  const response = await fetch(
                    `https://zipapi.co/api/${market.hostfm_address.zipcode}`,
                    {
                      timeout: 5000,
                      signal: AbortSignal.timeout(5000),
                    }
                  )
                  if (response.ok) {
                    data = await response.json()
                  }
                } catch (error) {
                  console.log(`Zipapi.co also failed for ${market.hostfm_name}`)
                }
              }

              if (data && data.latitude && data.longitude) {
                lat = parseFloat(data.latitude)
                lon = parseFloat(data.longitude)

                // Save coordinates to database for future use
                await HostFMarket.findByIdAndUpdate(market._id, {
                  'hostfm_address.coordinates': {
                    latitude: lat,
                    longitude: lon,
                  },
                })
              }
            } catch (error) {
              console.error(
                `All geocoding services failed for ${market.hostfm_name}:`,
                error
              )
            }
          }

          if (lat && lon) {
            const distance = calculateDistance(userLat, userLon, lat, lon)
            return { ...market, distance }
          }
          return { ...market, distance: null }
        })
      )

      // Filter by max distance (skip if unlimited)
      if (maxDistance !== 'unlimited') {
        markets = markets.filter(
          (market) => market.distance === null || market.distance <= maxDistance
        )
      }

      // Sort by distance if available
      if (sortBy === 'distance') {
        markets.sort((a, b) => {
          if (a.distance === null && b.distance === null) return 0
          if (a.distance === null) return 1
          if (b.distance === null) return -1
          return a.distance - b.distance
        })
      }
    }

    // Other sorting options
    if (sortBy === 'name') {
      markets.sort((a, b) => a.hostfm_name.localeCompare(b.hostfm_name))
    } else if (sortBy === 'created') {
      markets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    // Serialize for client
    const serializedMarkets = JSON.parse(JSON.stringify(markets))

    return NextResponse.json({
      success: true,
      markets: serializedMarkets,
      total: serializedMarkets.length,
      filters: {
        query,
        userLat,
        userLon,
        maxDistance,
        state,
        city,
        zipcode,
        sortBy,
      },
    })
  } catch (error) {
    console.error('Market search error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search markets',
      },
      { status: 500 }
    )
  }
}
