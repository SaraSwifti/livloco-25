'use client'

import { useState, useEffect } from 'react'
import MarketCard from '@/components/MarketCard'
import SearchFilters from '@/components/SearchFilters'

export default function SearchableMarketList({ initialMarkets = [] }) {
  const [markets, setMarkets] = useState(initialMarkets)
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    query: '',
    distance: 'unlimited',
    state: '',
    city: '',
    zipcode: '',
    sortBy: 'distance',
  })

  useEffect(() => {
    searchMarkets(filters)
  }, [filters])

  const searchMarkets = async (searchFilters) => {
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

      const response = await fetch(`/api/search/markets?${params}`)
      const data = await response.json()

      if (data.success) {
        setMarkets(data.markets)
      } else {
        console.error('Search failed:', data.error)
        setMarkets([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setMarkets([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-6'>
      <SearchFilters
        onFiltersChange={handleFiltersChange}
        initialFilters={filters}
        showLocationInput={true}
        searchPlaceholder='Search Markets...'
      />

      {isLoading ? (
        <div className='flex items-center justify-center h-64'>
          <div className='text-gray-500'>Searching markets...</div>
        </div>
      ) : markets.length === 0 ? (
        <div className='text-center py-12'>
          <div className='text-gray-500 text-lg mb-4'>No markets found</div>
          <p className='text-gray-400'>
            Try adjusting your search filters or expanding your search radius.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {markets.map((market) => (
            <MarketCard
              key={market._id}
              market={market}
            />
          ))}
        </div>
      )}

      {/* Results Summary */}
      {markets.length > 0 && (
        <div className='mt-8 text-center text-gray-600'>
          Showing {markets.length} market{markets.length !== 1 ? 's' : ''}
          {filters.query && ` matching "${filters.query}"`}
        </div>
      )}
    </div>
  )
}
