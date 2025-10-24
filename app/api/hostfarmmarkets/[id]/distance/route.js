import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import HostFMarket from '@/models/HostFMarket'
import { calculateDistance } from '@/utils/location'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)

    const userLat = parseFloat(searchParams.get('lat'))
    const userLon = parseFloat(searchParams.get('lon'))

    if (!userLat || !userLon || isNaN(userLat) || isNaN(userLon)) {
      return NextResponse.json(
        {
          success: false,
          error: 'User location required',
        },
        { status: 400 }
      )
    }

    await connectDB()

    const market = await HostFMarket.findById(id).lean()

    if (!market) {
      return NextResponse.json(
        {
          success: false,
          error: 'Market not found',
        },
        { status: 404 }
      )
    }

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
      return NextResponse.json({
        success: true,
        distance: distance,
        marketLocation: {
          latitude: lat,
          longitude: lon,
          address: market.hostfm_address,
        },
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Unable to determine market location',
      },
      { status: 400 }
    )
  } catch (error) {
    console.error('Market distance calculation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
