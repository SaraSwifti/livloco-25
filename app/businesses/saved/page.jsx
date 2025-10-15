// app/businesses/saved/page.jsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import connectDB from '@/config/database';
import User from '@/models/User';
import { authOptions } from '@/utils/authOptions';
import SavedItemCard from '@/components/SavedItemCard';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

// Make this page dynamic - don't cache it
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SavedBusinessesAndMarketsPage() {
  // Get session to verify user is logged in
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/');
  }

  await connectDB();

  // Fetch user's saved businesses and markets IDs first
  const user = await User.findOne({ email: session.user.email })
    .select('saved_businesses saved_markets')
    .lean();

  if (!user) {
    redirect('/');
  }

  console.log('Saved page - User found:', user._id)
  console.log('Saved page - saved_businesses:', user.saved_businesses)
  console.log('Saved page - saved_markets:', user.saved_markets)

  // Initialize arrays if they don't exist
  const savedBusinessIds = user.saved_businesses || [];
  const savedMarketIds = user.saved_markets || [];

  console.log('Saved page - savedBusinessIds count:', savedBusinessIds.length)
  console.log('Saved page - savedMarketIds count:', savedMarketIds.length)

  // Manually populate the businesses and markets
  let savedBusinesses = [];
  let savedMarkets = [];

  if (savedBusinessIds.length > 0) {
    const LocoBiz = (await import('@/models/LocoBiz')).default;
    const businesses = await LocoBiz.find({ _id: { $in: savedBusinessIds } }).lean();
    savedBusinesses = JSON.parse(JSON.stringify(businesses));
  }

  if (savedMarketIds.length > 0) {
    const HostFMarket = (await import('@/models/HostFMarket')).default;
    const markets = await HostFMarket.find({ _id: { $in: savedMarketIds } }).lean();
    savedMarkets = JSON.parse(JSON.stringify(markets));
  }

  const hasSavedItems = savedBusinesses.length > 0 || savedMarkets.length > 0;

  return (
    <section className="flex justify-center">
      <div className="max-w-6xl w-full mx-auto px-4 py-10">
        {/* Back button */}
        <Link
          href="/businesses"
          className="inline-flex items-center bg-white/80 px-3.5 py-2.5 text-lg mb-6 font-semibold text-black shadow-sm p-4 rounded border hover:bg-white"
        >
          <FaArrowLeft className="mr-2" /> Back to Businesses
        </Link>

        {/* Header */}
        <div className="bg-white p-6 border rounded-lg shadow-md ring-1 ring-black/10 mb-6">
          <h1 className="text-3xl font-bold text-center mb-2">
            Saved LivLoco Businesses and Markets
          </h1>
          <p className="text-center text-gray-600">
            Your saved businesses and markets appear here. Click on any item to view details or unsave them.
          </p>
        </div>

        {!hasSavedItems ? (
          <div className="bg-white p-10 border rounded-lg shadow-md ring-1 ring-black/10 text-center">
            <p className="text-lg text-gray-600 mb-4">
              You haven't saved any businesses or markets yet.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/businesses"
                className="inline-flex items-center bg-blue-600 px-4 py-2 text-white font-semibold rounded hover:bg-blue-700"
              >
                Browse Businesses
              </Link>
              <Link
                href="/hostfarmmarkets"
                className="inline-flex items-center bg-green-600 px-4 py-2 text-white font-semibold rounded hover:bg-green-700"
              >
                Browse Markets
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Saved Businesses Section */}
            {savedBusinesses.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-blue-800">
                  Saved Businesses ({savedBusinesses.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedBusinesses.map((business) => (
                    <SavedItemCard
                      key={business._id}
                      item={business}
                      type="business"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Saved Markets Section */}
            {savedMarkets.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-green-800">
                  Saved Markets ({savedMarkets.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedMarkets.map((market) => (
                    <SavedItemCard
                      key={market._id}
                      item={market}
                      type="market"
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
