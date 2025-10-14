// components/ProfileNavBar.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LocoStats from './LocoStats';
import ProfileChoiceSelector from './ProfileChoiceSelector';
import UserMembershipStats from '@/app/membership/[id]/page';

export default function ProfileNavBar({ user }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('stats');

  const tabs = [
    { id: 'stats', label: 'LocoStats' },
    { id: 'business', label: 'LocoBiz/LocoMarket Add/Edit' },
    { id: 'listing', label: 'Your Listing' },
    { id: 'membership', label: 'LocoMembership and Renewal' },
  ];

  // Determine what to render in listing tab based on profile_choice
  const renderListingTab = () => {
    const profileChoice = user?.profile_choice;

    // If no profile choice, show message
    if (profileChoice === 'none') {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            You haven't created a listing yet. Please select a profile type in the "LocoBiz/LocoMarket Add/Edit" tab.
          </p>
          <button
            onClick={() => setActiveTab('business')}
            className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-full transition-colors"
          >
            Go to Add/Edit
          </button>
        </div>
      );
    }

    // If locobiz, show button to view business listing
    if (profileChoice === 'locobiz' && user.locobiz) {
      const businessId = typeof user.locobiz === 'object' ? user.locobiz._id : user.locobiz;
      return (
        <div className="text-center py-8 space-y-4">
          <p className="text-gray-600 text-lg">
            View your LocoBusiness listing as visitors see it
          </p>
          <button
            onClick={() => router.push(`/businesses/${businessId}`)}
            className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-full transition-colors"
          >
            View Your LocoBusiness Listing
          </button>
        </div>
      );
    }

    // If hostfmarket, show button to view market listing
    if (profileChoice === 'hostfmarket' && user.hostfmarket) {
      const marketId = typeof user.hostfmarket === 'object' ? user.hostfmarket._id : user.hostfmarket;
      return (
        <div className="text-center py-8 space-y-4">
          <p className="text-gray-600 text-lg">
            View your LocoMarket listing as visitors see it
          </p>
          <button
            onClick={() => router.push(`/hostfarmmarkets/${marketId}`)}
            className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-full transition-colors"
          >
            View Your LocoMarket Listing
          </button>
        </div>
      );
    }

    // If profile choice is set but listing doesn't exist yet
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">
          Your listing hasn't been created yet. Please create it in the "LocoBiz/LocoMarket Add/Edit" tab.
        </p>
        <button
          onClick={() => setActiveTab('business')}
          className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-full transition-colors"
        >
          Go to Add/Edit
        </button>
      </div>
    );
  };

  // Determine what to render in business tab based on profile_choice
  const renderBusinessTab = () => {
    const profileChoice = user?.profile_choice;

    // If profile_choice is 'none', show the selector
    if (profileChoice === 'none') {
      return <ProfileChoiceSelector userId={user._id} />;
    }

    // If profile_choice is 'locobiz', show edit button for business
    if (profileChoice === 'locobiz') {
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Your LocoBusiness</h2>
          {user.locobiz ? (
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 border rounded-lg">
                <h3 className="text-xl font-semibold mb-2">
                  {user.locobiz.locobiz_name || 'Your Business'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {user.locobiz.locobiz_description || 'No description'}
                </p>
              </div>
              <button
                onClick={() => router.push('/businesses/edit')}
                className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-full transition-colors"
              >
                Edit LocoBusiness
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Your business profile is being set up...
              </p>
              <button
                onClick={() => router.push('/businesses/add')}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full"
              >
                Create LocoBusiness
              </button>
            </div>
          )}
        </div>
      );
    }

    // If profile_choice is 'hostfmarket', show edit button for market
    if (profileChoice === 'hostfmarket') {
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Your LocoMarket</h2>
          {user.hostfmarket ? (
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 border rounded-lg">
                <h3 className="text-xl font-semibold mb-2">
                  {user.hostfmarket.hostfm_name || 'Your Market'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {user.hostfmarket.hostfm_description || 'No description'}
                </p>
              </div>
              <button
                onClick={() => router.push('/hostfarmmarkets/edit')}
                className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-full transition-colors"
              >
                Edit LocoMarket
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Your market profile is being set up...
              </p>
              <button
                onClick={() => router.push('/hostfarmmarkets/add')}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full"
              >
                Create LocoMarket
              </button>
            </div>
          )}
        </div>
      );
    }

    // Fallback
    return (
      <div className="text-center text-gray-600">
        <p>No profile type selected.</p>
      </div>
    );
  };

  return (
    <div className="bg-white border rounded-lg shadow-md ring-1 ring-black/10">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex flex-col sm:flex-row -mb-px" aria-label="Profile tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 py-4 px-4 text-center text-xs sm:text-sm font-medium border-b-2 transition-colors
                ${
                  activeTab === tab.id
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
      <div className="p-6">
        {activeTab === 'stats' && <LocoStats user={user} />}
        {activeTab === 'business' && renderBusinessTab()}
        {activeTab === 'listing' && renderListingTab()}
        {activeTab === 'membership' && <UserMembershipStats />}
      </div>
    </div>
  );
}
