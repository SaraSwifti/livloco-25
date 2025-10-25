'use client'

import { useState, useEffect } from 'react'
import MemberCard from '@/components/MemberCard'

export default function RecentMembersPage() {
  const [members, setMembers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('/api/recent-members')
        const data = await response.json()

        if (data.success) {
          setMembers(data.members)
        } else {
          setError(data.error || 'Failed to fetch members')
        }
      } catch (err) {
        setError('Failed to fetch members')
        console.error('Error fetching members:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMembers()
  }, [])

  const businessMembers = members.filter((member) => member.type === 'business')
  const marketMembers = members.filter((member) => member.type === 'market')

  return (
    <div className='-mx-4 -mt-8'>
      {/* Hero Section */}
      <section className='mb-4 relative'>
        <div className='livloco-hero'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center relative z-10'>
            {/* Header Content */}
            <div className='text-center'>
              <h1 className='livloco-hero-title mb-2'>
                Recently Joined LocoBusinesses and LocoMarkets
              </h1>
              <p className='livloco-hero-subtitle'>
                Discover the latest members who have joined our co-op community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className='max-w-7xl mx-auto px-4 py-6 mt-8 bg-white'>
        {isLoading ? (
          <div className='flex items-center justify-center h-64'>
            <div className='text-gray-500'>Loading recent members...</div>
          </div>
        ) : error ? (
          <div className='text-center py-12'>
            <div className='text-red-500 text-lg mb-4'>
              Error loading members
            </div>
            <p className='text-gray-400'>{error}</p>
          </div>
        ) : members.length === 0 ? (
          <div className='text-center py-12'>
            <div className='text-gray-500 text-lg mb-4'>
              No recent members found
            </div>
            <p className='text-gray-400'>
              Check back later for new members joining our co-op.
            </p>
          </div>
        ) : (
          <div className='space-y-12'>
            {/* Recently Joined LocoBusinesses */}
            {businessMembers.length > 0 && (
              <div>
                <h2 className='text-2xl font-bold text-gray-900 mb-6 text-center'>
                  Recently Joined LocoBusinesses
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {businessMembers.map((member) => (
                    <MemberCard
                      key={`business-${member._id}`}
                      member={member}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Recently Joined LocoMarkets */}
            {marketMembers.length > 0 && (
              <div>
                <h2 className='text-2xl font-bold text-gray-900 mb-6 text-center'>
                  Recently Joined LocoMarkets
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {marketMembers.map((member) => (
                    <MemberCard
                      key={`market-${member._id}`}
                      member={member}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results Summary */}
        {members.length > 0 && (
          <div className='mt-8 text-center text-gray-600'>
            Showing {members.length} recent members
            {businessMembers.length > 0 && marketMembers.length > 0 && (
              <span>
                {' '}
                ({businessMembers.length} businesses, {marketMembers.length}{' '}
                markets)
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
