// components/ProfileNavBar.jsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LocoStats from './LocoStats'
import ProfileChoiceSelector from './ProfileChoiceSelector'
import UserMembershipStats from '@/app/membership/[id]/page'
import ProfileEditForm from './ProfileEditForm'

export default function ProfileNavBar({ user }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('stats')

  const tabs = [
    { id: 'stats', label: 'LocoStats' },
    { id: 'business', label: 'LocoBiz/LocoMarket Add/Edit' },
    { id: 'listing', label: 'Your Listing' },
    { id: 'membership', label: 'LocoMembership Profile and Renewal' },
    // Add admin tab for super_admin users
    ...(user?.role === 'super_admin'
      ? [{ id: 'admin', label: 'Admin Panel' }]
      : []),
  ]

  // Determine what to render in listing tab based on profile_choice
  const renderListingTab = () => {
    const profileChoice = user?.profile_choice

    // If no profile choice, show message
    if (profileChoice === 'none') {
      return (
        <div className='text-center py-8'>
          <p className='text-gray-600 mb-4'>
            You haven't created a listing yet. Please select a profile type in
            the "LocoBiz/LocoMarket Add/Edit" tab.
          </p>
          <button
            onClick={() => setActiveTab('business')}
            className='bg-black hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-full transition-colors'
          >
            Go to Add/Edit
          </button>
        </div>
      )
    }

    // If locobiz, show button to view business listing
    if (profileChoice === 'locobiz' && user.locobiz) {
      const businessId =
        typeof user.locobiz === 'object' ? user.locobiz._id : user.locobiz
      return (
        <div className='text-center py-8 space-y-4'>
          <p className='text-gray-600 text-lg'>
            View your LocoBusiness listing as visitors see it
          </p>
          <button
            onClick={() => router.push(`/businesses/${businessId}`)}
            className='bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-full transition-colors'
          >
            View Your LocoBusiness Listing
          </button>
        </div>
      )
    }

    // If hostfmarket, show button to view market listing
    if (profileChoice === 'hostfmarket' && user.hostfmarket) {
      const marketId =
        typeof user.hostfmarket === 'object'
          ? user.hostfmarket._id
          : user.hostfmarket
      return (
        <div className='text-center py-8 space-y-4'>
          <p className='text-gray-600 text-lg'>
            View your LocoMarket listing as visitors see it
          </p>
          <button
            onClick={() => router.push(`/hostfarmmarkets/${marketId}`)}
            className='bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-full transition-colors'
          >
            View Your LocoMarket Listing
          </button>
        </div>
      )
    }

    // If profile choice is set but listing doesn't exist yet
    return (
      <div className='text-center py-8'>
        <p className='text-gray-600 mb-4'>
          Your listing hasn't been created yet. Please create it in the
          "LocoBiz/LocoMarket Add/Edit" tab.
        </p>
        <button
          onClick={() => setActiveTab('business')}
          className='bg-black hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-full transition-colors'
        >
          Go to Add/Edit
        </button>
      </div>
    )
  }

  // Determine what to render in business tab based on profile_choice
  const renderBusinessTab = () => {
    const profileChoice = user?.profile_choice

    // If profile_choice is 'none', show the selector
    if (profileChoice === 'none') {
      return <ProfileChoiceSelector userId={user._id} />
    }

    // If profile_choice is 'locobiz', show edit button for business
    if (profileChoice === 'locobiz') {
      return (
        <div className='space-y-4'>
          <h2 className='text-2xl font-bold text-center'>Your LocoBusiness</h2>
          {user.locobiz ? (
            <div className='space-y-4'>
              <div className='bg-gray-50 p-6 border rounded-lg'>
                <h3 className='text-xl font-semibold mb-2'>
                  {user.locobiz.locobiz_name || 'Your Business'}
                </h3>
                <p className='text-gray-600 mb-4'>
                  {user.locobiz.locobiz_description || 'No description'}
                </p>
              </div>
              <button
                onClick={() => router.push('/businesses/edit')}
                className='w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-full transition-colors'
              >
                Edit LocoBusiness
              </button>
            </div>
          ) : (
            <div className='text-center py-8'>
              <p className='text-gray-600 mb-4'>
                Your business profile is being set up...
              </p>
              <button
                onClick={() => router.push('/businesses/add')}
                className='bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full'
              >
                Create LocoBusiness
              </button>
            </div>
          )}
        </div>
      )
    }

    // If profile_choice is 'hostfmarket', show edit button for market
    if (profileChoice === 'hostfmarket') {
      return (
        <div className='space-y-4'>
          <h2 className='text-2xl font-bold text-center'>Your LocoMarket</h2>
          {user.hostfmarket ? (
            <div className='space-y-4'>
              <div className='bg-gray-50 p-6 border rounded-lg'>
                <h3 className='text-xl font-semibold mb-2'>
                  {user.hostfmarket.hostfm_name || 'Your Market'}
                </h3>
                <p className='text-gray-600 mb-4'>
                  {user.hostfmarket.hostfm_type || 'No market type specified'}
                </p>
              </div>
              <button
                onClick={() => router.push('/hostfarmmarkets/edit')}
                className='w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-full transition-colors'
              >
                Edit LocoMarket
              </button>
            </div>
          ) : (
            <div className='text-center py-8'>
              <p className='text-gray-600 mb-4'>
                Your market profile is being set up...
              </p>
              <button
                onClick={() => router.push('/hostfarmmarkets/add')}
                className='bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full'
              >
                Create LocoMarket
              </button>
            </div>
          )}
        </div>
      )
    }

    // Fallback
    return (
      <div className='text-center text-gray-600'>
        <p>No profile type selected.</p>
      </div>
    )
  }

  // Render membership tab content
  const renderMembershipTab = () => {
    return (
      <div className='space-y-8'>
        {/* Profile Edit Form */}
        <div>
          <h2 className='text-2xl font-bold text-center mb-6'>
            Profile Settings
          </h2>
          <ProfileEditForm user={user} />
        </div>

        {/* Divider */}
        <div className='border-t border-gray-200'></div>

        {/* Membership Stats */}
        <div>
          <h2 className='text-2xl font-bold text-center mb-6'>
            Membership Information
          </h2>
          <UserMembershipStats />
        </div>
      </div>
    )
  }

  // Render admin tab content
  const renderAdminTab = () => {
    return (
      <div className='space-y-6'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold mb-4'>Admin Panel</h2>
          <p className='text-gray-600 mb-6'>
            Access the full admin dashboard to manage coupons, users, and system
            settings.
          </p>
        </div>

        <div className='flex justify-center'>
          <button
            onClick={() => router.push('/admin')}
            className='bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-lg'
          >
            Go to Admin Dashboard
          </button>
        </div>

        <div className='bg-gray-50 p-6 rounded-lg border'>
          <h3 className='text-lg font-semibold mb-3'>Admin Capabilities</h3>
          <ul className='space-y-2 text-sm text-gray-700'>
            <li>• Create and manage discount coupons</li>
            <li>• Set usage limits and track coupon performance</li>
            <li>• Monitor system analytics and user activity</li>
            <li>• Manage user accounts and permissions</li>
            <li>• Access system-wide settings and controls</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-white border rounded-lg shadow-md ring-1 ring-black/10'>
      {/* Tab Navigation */}
      <div className='border-b border-gray-200'>
        <nav
          className='flex flex-col sm:flex-row -mb-px'
          aria-label='Profile tabs'
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 py-4 px-4 text-center text-xs sm:text-sm font-medium border-b-2 transition-colors
                ${
                  activeTab === tab.id
                    ? 'border-transparent text-black bg-white'
                    : 'border-transparent text-black bg-gray-300 hover:bg-gray-200'
                }
              `}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className='p-6'>
        {activeTab === 'stats' && <LocoStats user={user} />}
        {activeTab === 'business' && renderBusinessTab()}
        {activeTab === 'listing' && renderListingTab()}
        {activeTab === 'membership' && renderMembershipTab()}
        {activeTab === 'admin' && renderAdminTab()}
      </div>
    </div>
  )
}
