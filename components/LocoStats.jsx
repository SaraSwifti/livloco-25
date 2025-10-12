// components/LocoStats.jsx
'use client';

export default function LocoStats({ user }) {
  // Placeholder data - will be implemented with actual tracking later
  const stats = {
    businessClicks: 0,
    marketClicks: 0,
    businessVotes: user?.locobiz?.votes ?? 0,
    marketVotes: user?.hostfmarket?.votes ?? 0,
  };

  const hasLocoBiz = user?.profile_choice === 'locobiz' && user?.locobiz;
  const hasHostFMarket = user?.profile_choice === 'hostfmarket' && user?.hostfmarket;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-black">Your LocoStats</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Card Clicks */}
        {hasLocoBiz && (
          <div className="bg-gray-50 p-6 border rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              LocoBiz Card Clicks
            </h3>
            <div className="text-4xl font-bold text-black">{stats.businessClicks}</div>
            <p className="text-sm text-gray-600 mt-2">
              Number of times your business card has been clicked
            </p>
          </div>
        )}

        {/* Market Card Clicks */}
        {hasHostFMarket && (
          <div className="bg-gray-50 p-6 border rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              LocoMarket Card Clicks
            </h3>
            <div className="text-4xl font-bold text-black">{stats.marketClicks}</div>
            <p className="text-sm text-gray-600 mt-2">
              Number of times your market card has been clicked
            </p>
          </div>
        )}

        {/* Business Votes */}
        {hasLocoBiz && (
          <div className="bg-gray-50 p-6 border rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">LocoBiz Votes</h3>
            <div className="text-4xl font-bold text-black">{stats.businessVotes}</div>
            <p className="text-sm text-gray-600 mt-2">
              Votes received for your business
            </p>
          </div>
        )}

        {/* Market Votes */}
        {hasHostFMarket && (
          <div className="bg-gray-50 p-6 border rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              LocoMarket Votes
            </h3>
            <div className="text-4xl font-bold text-black">{stats.marketVotes}</div>
            <p className="text-sm text-gray-600 mt-2">
              Votes received for your farmers market
            </p>
          </div>
        )}
      </div>

      {/* No Profile Message */}
      {!hasLocoBiz && !hasHostFMarket && (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">
            You haven't created a LocoBiz or LocoMarket yet.
          </p>
          <p className="text-gray-500 mt-2">
            Create one to start tracking your stats!
          </p>
        </div>
      )}

      {/* Note about click tracking */}
      {(hasLocoBiz || hasHostFMarket) && (
        <div className="bg-blue-50 p-4 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Click tracking will be implemented in a future update.
            Votes are currently displayed from your listing data.
          </p>
        </div>
      )}
    </div>
  );
}
