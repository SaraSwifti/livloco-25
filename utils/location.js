// utils/location.js
// Location detection and distance calculation utilities

/**
 * Get user's location from browser geolocation API
 * @returns {Promise<{latitude: number, longitude: number, source: string}>}
 */
export async function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          source: 'browser',
        })
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    )
  })
}

/**
 * Get user's location from IP address (fallback)
 * @returns {Promise<{latitude: number, longitude: number, source: string}>}
 */
export async function getLocationFromIP() {
  try {
    const response = await fetch('/api/location/ip-location')
    const data = await response.json()

    if (data.success) {
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        source: 'ip',
      }
    }
    throw new Error('IP location failed')
  } catch (error) {
    throw new Error(`IP location failed: ${error.message}`)
  }
}

/**
 * Get coordinates from zipcode using geocoding
 * @param {string} zipcode - 5-digit zipcode
 * @returns {Promise<{latitude: number, longitude: number, source: string}>}
 */
export async function getLocationFromZipcode(zipcode) {
  try {
    const response = await fetch(
      `/api/location/zipcode-location?zipcode=${zipcode}`
    )
    const data = await response.json()

    if (data.success) {
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        source: 'zipcode',
      }
    }
    throw new Error('Zipcode geocoding failed')
  } catch (error) {
    throw new Error(`Zipcode geocoding failed: ${error.message}`)
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in miles
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959 // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return Math.round(distance * 10) / 10 // Round to 1 decimal place
}

/**
 * Convert degrees to radians
 * @param {number} degrees
 * @returns {number} radians
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180)
}

/**
 * Get user's best available location
 * @param {string} fallbackZipcode - Optional zipcode fallback
 * @returns {Promise<{latitude: number, longitude: number, source: string}>}
 */
export async function getUserLocation(fallbackZipcode = null) {
  // Try browser geolocation first
  try {
    const location = await getCurrentLocation()
    return location
  } catch (error) {
    console.log('Browser geolocation failed:', error.message)
  }

  // Try IP-based location
  try {
    const location = await getLocationFromIP()
    return location
  } catch (error) {
    console.log('IP location failed:', error.message)
  }

  // Try zipcode fallback
  if (fallbackZipcode) {
    try {
      const location = await getLocationFromZipcode(fallbackZipcode)
      return location
    } catch (error) {
      console.log('Zipcode geocoding failed:', error.message)
    }
  }

  // Default fallback (center of US)
  return {
    latitude: 39.8283,
    longitude: -98.5795,
    source: 'default',
  }
}

/**
 * Format distance for display
 * @param {number} distance - Distance in miles
 * @returns {string} Formatted distance string
 */
export function formatDistance(distance) {
  if (distance < 0.1) {
    // For very small distances, show in feet with more precision
    const feet = Math.round(distance * 5280)
    return feet < 10 ? `${feet} ft` : `${feet} ft`
  } else if (distance < 1) {
    // For distances under 1 mile, show to 1 decimal place
    return `${distance.toFixed(1)} mi`
  } else if (distance < 10) {
    // For distances under 10 miles, show to 1 decimal place
    return `${distance.toFixed(1)} mi`
  } else {
    // For longer distances, round to whole miles
    return `${Math.round(distance)} mi`
  }
}
