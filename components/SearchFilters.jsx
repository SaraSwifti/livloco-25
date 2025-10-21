'use client'

import { useState, useEffect } from 'react'
import { FaMapMarkerAlt, FaSearch, FaFilter, FaTimes } from 'react-icons/fa'
import { getUserLocation, getLocationFromZipcode } from '@/utils/location'

export default function SearchFilters({
  onFiltersChange,
  initialFilters = {},
  showLocationInput = true,
  searchPlaceholder = 'Search businesses or markets...',
}) {
  const [filters, setFilters] = useState({
    query: '',
    distance: 'unlimited',
    state: '',
    city: '',
    zipcode: '',
    sortBy: 'distance',
    ...initialFilters,
  })

  const [userLocation, setUserLocation] = useState(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    // Try to get user's location on component mount
    getInitialLocation()
  }, [])

  const getInitialLocation = async () => {
    setIsLoadingLocation(true)
    try {
      const location = await getUserLocation()
      setUserLocation(location)

      // Update filters with user location
      const newFilters = {
        ...filters,
        userLat: location.latitude,
        userLon: location.longitude,
        source: location.source,
      }
      setFilters(newFilters)
      onFiltersChange(newFilters)
    } catch (error) {
      console.error('Failed to get user location:', error)
    } finally {
      setIsLoadingLocation(false)
    }
  }

  const handleInputChange = (field, value) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleZipcodeSearch = async () => {
    if (!filters.zipcode || !/^\d{5}(-\d{4})?$/.test(filters.zipcode)) {
      alert('Please enter a valid 5-digit zipcode')
      return
    }

    setIsLoadingLocation(true)
    try {
      const location = await getLocationFromZipcode(filters.zipcode)
      setUserLocation(location)

      const newFilters = {
        ...filters,
        userLat: location.latitude,
        userLon: location.longitude,
        source: location.source,
      }
      setFilters(newFilters)
      onFiltersChange(newFilters)
    } catch (error) {
      console.error('Zipcode search error:', error)
      alert(`Failed to get location from zipcode: ${error.message}`)
    } finally {
      setIsLoadingLocation(false)
    }
  }

  const clearFilters = () => {
    const clearedFilters = {
      query: '',
      distance: 'unlimited',
      state: '',
      city: '',
      zipcode: '',
      sortBy: 'distance',
      userLat: userLocation?.latitude,
      userLon: userLocation?.longitude,
      source: userLocation?.source,
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  return (
    <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
      {/* Search Bar */}
      <div className='mb-4'>
        <div className='relative'>
          <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
          <input
            type='text'
            placeholder={searchPlaceholder}
            value={filters.query}
            onChange={(e) => handleInputChange('query', e.target.value)}
            className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>
      </div>

      {/* Location and Distance */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
        {/* Distance Filter */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Distance
          </label>
          <select
            value={filters.distance}
            onChange={(e) =>
              handleInputChange(
                'distance',
                e.target.value === 'unlimited'
                  ? 'unlimited'
                  : parseInt(e.target.value)
              )
            }
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          >
            <option value={5}>5 miles</option>
            <option value={10}>10 miles</option>
            <option value={25}>25 miles</option>
            <option value={50}>50 miles</option>
            <option value={100}>100 miles</option>
            <option value={200}>200 miles</option>
            <option value='unlimited'>Anywhere in the USA</option>
          </select>
        </div>

        {/* Current Location Status */}
        <div className='flex items-center'>
          <FaMapMarkerAlt className='text-blue-500 mr-2' />
          <div>
            <p className='text-sm font-medium text-gray-700'>
              {isLoadingLocation ? 'Getting location...' : 'Location'}
            </p>
            <p className='text-xs text-gray-500'>
              {userLocation
                ? `Source: ${userLocation.source}`
                : 'Location not available'}
            </p>
          </div>
        </div>

        {/* Zipcode Input */}
        {showLocationInput && (
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Zipcode
            </label>
            <div className='flex'>
              <input
                type='text'
                placeholder='12345'
                value={filters.zipcode}
                onChange={(e) => handleInputChange('zipcode', e.target.value)}
                className='flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                maxLength={10}
              />
              <button
                onClick={handleZipcodeSearch}
                disabled={isLoadingLocation}
                className='px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 disabled:bg-gray-400'
              >
                Go
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Filters Toggle */}
      <div className='flex items-center justify-between mb-4'>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className='flex items-center text-blue-600 hover:text-blue-800'
        >
          <FaFilter className='mr-2' />
          Advanced Filters
        </button>

        <button
          onClick={clearFilters}
          className='flex items-center text-gray-600 hover:text-gray-800'
        >
          <FaTimes className='mr-2' />
          Clear All
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pt-4 border-t border-gray-200'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              State
            </label>
            <input
              type='text'
              placeholder='e.g., CA'
              value={filters.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              maxLength={2}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              City
            </label>
            <input
              type='text'
              placeholder='e.g., Los Angeles'
              value={filters.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleInputChange('sortBy', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              <option value='distance'>Distance</option>
              <option value='name'>Name</option>
              <option value='created'>Newest</option>
            </select>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className='text-sm text-gray-600'>
        {userLocation ? (
          <span>
            {filters.distance === 'unlimited'
              ? 'Showing results anywhere in the USA'
              : `Showing results within ${filters.distance} miles of your location`}
            {filters.query && ` matching "${filters.query}"`}
          </span>
        ) : (
          <span>
            Showing all results
            {filters.query && ` matching "${filters.query}"`}
          </span>
        )}
      </div>
    </div>
  )
}
