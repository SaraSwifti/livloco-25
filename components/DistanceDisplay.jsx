'use client'

import { useState, useEffect } from 'react'
import { formatDistance } from '@/utils/location'

export default function DistanceDisplay({ businessId, className = '' }) {
  const [distance, setDistance] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    calculateDistance()
  }, [businessId])

  const calculateDistance = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Get user's current location
      const location = await getUserLocation()

      if (!location) {
        setError('Location not available')
        return
      }

      // Call our distance API
      const response = await fetch(
        `/api/businesses/${businessId}/distance?lat=${location.latitude}&lon=${location.longitude}`
      )

      const data = await response.json()

      if (data.success) {
        setDistance(data.distance)
      } else {
        setError(data.error || 'Failed to calculate distance')
      }
    } catch (error) {
      console.error('Distance calculation error:', error)
      setError('Failed to calculate distance')
    } finally {
      setIsLoading(false)
    }
  }

  const getUserLocation = async () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          console.error('Geolocation error:', error)
          resolve(null)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      )
    })
  }

  if (isLoading) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        Calculating distance...
      </div>
    )
  }

  if (error) {
    return (
      <button
        onClick={calculateDistance}
        className={`text-sm text-blue-600 hover:text-blue-800 underline ${className}`}
        title='Click to retry distance calculation'
      >
        Show distance
      </button>
    )
  }

  if (distance !== null) {
    return (
      <div className={`text-sm text-gray-600 ${className}`}>
        {formatDistance(distance)} away
      </div>
    )
  }

  return null
}
