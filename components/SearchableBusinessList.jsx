'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import BusinessCard from '@/components/BusinessCard'
import SearchFilters from '@/components/SearchFilters'
import logo from '@/assets/images/newlivlocologo.png'

export default function SearchableBusinessList({ initialBusinesses = [] }) {
  const [businesses, setBusinesses] = useState(initialBusinesses)
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    query: '',
    distance: 'unlimited',
    state: '',
    city: '',
    zipcode: '',
    sortBy: 'distance',
  })
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    // Try to restore user location from sessionStorage on first load
    const savedLocation = sessionStorage.getItem('userLocation')
    if (savedLocation) {
      try {
        const location = JSON.parse(savedLocation)
        const newFilters = {
          ...filters,
          userLat: location.latitude,
          userLon: location.longitude,
          source: location.source,
        }
        setFilters(newFilters)
        setHasInitialized(true)
        return
      } catch (error) {
        console.error('Failed to restore location from sessionStorage:', error)
      }
    }

    setHasInitialized(true)
  }, [])

  // Handle filter changes after initialization
  useEffect(() => {
    if (hasInitialized) {
      searchBusinesses(filters)
    }
  }, [filters, hasInitialized])

  const searchBusinesses = async (searchFilters) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()

      if (searchFilters.query) params.append('q', searchFilters.query)
      if (searchFilters.userLat) params.append('lat', searchFilters.userLat)
      if (searchFilters.userLon) params.append('lon', searchFilters.userLon)
      if (searchFilters.distance)
        params.append('distance', searchFilters.distance)
      if (searchFilters.state) params.append('state', searchFilters.state)
      if (searchFilters.city) params.append('city', searchFilters.city)
      if (searchFilters.zipcode) params.append('zipcode', searchFilters.zipcode)
      if (searchFilters.sortBy) params.append('sort', searchFilters.sortBy)

      const response = await fetch(`/api/search/businesses?${params}`)
      const data = await response.json()

      if (data.success) {
        setBusinesses(data.businesses)
      } else {
        console.error('Search failed:', data.error)
        setBusinesses([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setBusinesses([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
    if (!hasInitialized) {
      setHasInitialized(true)
    }

    // Save user location to sessionStorage if available
    if (newFilters.userLat && newFilters.userLon) {
      const location = {
        latitude: newFilters.userLat,
        longitude: newFilters.userLon,
        source: newFilters.source || 'unknown',
      }
      sessionStorage.setItem('userLocation', JSON.stringify(location))
    }
  }

  return (
    <div className='-mx-4 -mt-8'>
      {/* Hero Section with Search - Full Width */}
      <section className='mb-4 relative'>
        <div className='w-full bg-gradient-to-r from-green-600 via-green-500 to-blue-600 relative'>
          <div className='max-w-7xl py-4 pb-1 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center relative z-10'>
            {/* Logo: top-center on mobile, right 1/4 on md+ */}
            <div className='order-1 md:order-2 w-full md:w-1/4 mb-2 md:mb-0 flex justify-center md:justify-end'>
              <Image
                src={logo}
                alt='LivLoco logo'
                className='h-auto w-auto object-contain'
                width={120}
                height={120}
              />
            </div>

            {/* Text + Form: 3/4 on md+, full on mobile */}
            <div className='order-2 md:order-1 w-full md:w-3/4 md:pr-6 text-center md:text-left'>
              <h1 className='text-2xl font-extrabold drop-shadow-2xl text-white sm:text-3xl md:text-4xl'>
                Find Your LocoPeeps
              </h1>
              <p className='my-2 font-bold drop-shadow-2xl text-sm text-white'>
                Local businesses finding local businesses. Creating local
                economies right where you live.
              </p>
            </div>
          </div>

          {/* Search Filters with white form fields */}
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2 relative z-10'>
            <div className='bg-transparent rounded-lg p-2'>
              <SearchFilters
                onFiltersChange={handleFiltersChange}
                initialFilters={filters}
                showLocationInput={true}
                searchPlaceholder='Search Businesses...'
              />
            </div>
          </div>

          {/* Wavy bottom design */}
          <div className='absolute bottom-0 left-0 w-full overflow-hidden'>
            <svg
              className='relative block w-full h-10'
              data-name='Layer 1'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 1200 120'
              preserveAspectRatio='none'
            >
              <path
                d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z'
                className='fill-white'
              ></path>
            </svg>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className='max-w-7xl mx-auto px-4 py-6 mt-8'>
        {isLoading ? (
          <div className='flex items-center justify-center h-64'>
            <div className='text-gray-500'>Searching businesses...</div>
          </div>
        ) : businesses.length === 0 ? (
          <div className='text-center py-12'>
            <div className='text-gray-500 text-lg mb-4'>
              No businesses found
            </div>
            <p className='text-gray-400'>
              Try adjusting your search filters or expanding your search radius.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {businesses.map((business) => (
              <BusinessCard
                key={business._id}
                locobiz={business}
              />
            ))}
          </div>
        )}

        {/* Results Summary */}
        {businesses.length > 0 && (
          <div className='mt-8 text-center text-gray-600'>
            Showing {businesses.length} business
            {businesses.length !== 1 ? 'es' : ''}
            {filters.query && ` matching "${filters.query}"`}
          </div>
        )}
      </div>
    </div>
  )
}
