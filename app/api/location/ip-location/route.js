import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('IP location request')

    // Try multiple IP geolocation services as fallbacks
    const services = ['https://ipapi.co/json/', 'https://ipinfo.io/json/']

    for (const serviceUrl of services) {
      try {
        console.log('Trying IP service:', serviceUrl)
        const response = await fetch(serviceUrl, {
          timeout: 10000,
        })

        if (!response.ok) {
          console.log('IP service failed:', serviceUrl, response.status)
          continue
        }

        const data = await response.json()
        console.log('IP service response:', serviceUrl, data)

        // Handle ipapi.co response
        if (
          serviceUrl.includes('ipapi.co') &&
          data.latitude &&
          data.longitude
        ) {
          return NextResponse.json({
            success: true,
            latitude: data.latitude,
            longitude: data.longitude,
            city: data.city,
            region: data.region,
            country: data.country,
          })
        }

        // Handle ipinfo.io response
        if (serviceUrl.includes('ipinfo.io') && data.loc) {
          const [lat, lon] = data.loc.split(',').map(parseFloat)
          if (!isNaN(lat) && !isNaN(lon)) {
            return NextResponse.json({
              success: true,
              latitude: lat,
              longitude: lon,
              city: data.city,
              region: data.region,
              country: data.country,
            })
          }
        }
      } catch (serviceError) {
        console.error('IP service error for', serviceUrl, ':', serviceError)
        continue
      }
    }

    throw new Error('All IP geolocation services failed')
  } catch (error) {
    console.error('IP location error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Unable to determine location from IP address',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
