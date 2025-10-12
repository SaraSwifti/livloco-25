// components/ProfileChoiceSelector.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileChoiceSelector({ userId }) {
  const router = useRouter();
  const [selectedChoice, setSelectedChoice] = useState('none');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedChoice === 'none') {
      alert('Please select LocoBusiness or LocoMarket to continue.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Navigate to the appropriate add page
      if (selectedChoice === 'locobiz') {
        router.push('/businesses/add');
      } else if (selectedChoice === 'hostfmarket') {
        router.push('/hostfarmmarkets/add');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      alert('There was a problem. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Profile Type</h2>
        <p className="text-gray-600">
          Select whether you want to add a LocoBusiness or host a LocoMarket.
          You can change this later.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 p-6 border rounded-lg space-y-4">
          {/* None Option */}
          <label className="flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer hover:bg-white transition-colors">
            <input
              type="radio"
              name="profile_choice"
              value="none"
              checked={selectedChoice === 'none'}
              onChange={(e) => setSelectedChoice(e.target.value)}
              className="mt-1 w-5 h-5"
            />
            <div>
              <div className="font-semibold text-lg">None</div>
              <p className="text-sm text-gray-600">
                I don't want to add a profile right now. I just want to browse as a member.
              </p>
            </div>
          </label>

          {/* LocoBusiness Option */}
          <label className="flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer hover:bg-white transition-colors hover:border-green-500">
            <input
              type="radio"
              name="profile_choice"
              value="locobiz"
              checked={selectedChoice === 'locobiz'}
              onChange={(e) => setSelectedChoice(e.target.value)}
              className="mt-1 w-5 h-5"
            />
            <div>
              <div className="font-semibold text-lg">LocoBusiness</div>
              <p className="text-sm text-gray-600">
                Add your local business, farm, food truck, or service. Connect with your community
                and share what you're selling and what you need.
              </p>
            </div>
          </label>

          {/* HostFMarket Option */}
          <label className="flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer hover:bg-white transition-colors hover:border-green-500">
            <input
              type="radio"
              name="profile_choice"
              value="hostfmarket"
              checked={selectedChoice === 'hostfmarket'}
              onChange={(e) => setSelectedChoice(e.target.value)}
              className="mt-1 w-5 h-5"
            />
            <div>
              <div className="font-semibold text-lg">Host a LocoMarket</div>
              <p className="text-sm text-gray-600">
                Host your own farmers market or community gathering. Set your schedule, manage
                stall availability, and bring local vendors together.
              </p>
            </div>
          </label>
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting || selectedChoice === 'none'}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            {isSubmitting ? 'Loading...' : 'Continue'}
          </button>
        </div>
      </form>

      <div className="bg-blue-50 p-4 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Every LivLoco Co-op membership includes the ability to post
          a business or host a market at no additional charge. You can update your choice
          at any time from your profile.
        </p>
      </div>
    </div>
  );
}
