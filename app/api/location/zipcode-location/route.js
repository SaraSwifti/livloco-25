import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const zipcode = searchParams.get('zipcode')

    console.log('Zipcode location request for:', zipcode)

    if (!zipcode || !/^\d{5}(-\d{4})?$/.test(zipcode)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Valid 5-digit zipcode required',
        },
        { status: 400 }
      )
    }

    // Try multiple geocoding services as fallbacks
    const services = [
      `https://zipapi.co/api/${zipcode}`,
      `https://api.zippopotam.us/us/${zipcode}`,
    ]

    for (const serviceUrl of services) {
      try {
        console.log('Trying service:', serviceUrl)
        const response = await fetch(serviceUrl, {
          timeout: 10000,
        })

        if (!response.ok) {
          console.log('Service failed:', serviceUrl, response.status)
          continue
        }

        const data = await response.json()
        console.log('Service response:', serviceUrl, data)

        // Handle zipapi.co response
        if (
          serviceUrl.includes('zipapi.co') &&
          data.latitude &&
          data.longitude
        ) {
          return NextResponse.json({
            success: true,
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
            city: data.city,
            state: data.state,
            zipcode: data.zip_code,
          })
        }

        // Handle zippopotam.us response
        if (
          serviceUrl.includes('zippopotam.us') &&
          data.places &&
          data.places.length > 0
        ) {
          const place = data.places[0]
          return NextResponse.json({
            success: true,
            latitude: parseFloat(place.latitude),
            longitude: parseFloat(place.longitude),
            city: place['place name'],
            state: place.state,
            zipcode: data['post code'],
          })
        }
      } catch (serviceError) {
        console.error('Service error for', serviceUrl, ':', serviceError)
        continue
      }
    }

    throw new Error('All geocoding services failed')
  } catch (error) {
    console.error('Zipcode location error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Unable to determine location from zipcode',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
