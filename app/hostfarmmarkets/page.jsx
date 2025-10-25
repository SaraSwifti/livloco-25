import SearchableMarketList from '@/components/SearchableMarketList'
// import markets from '@/app/hostfmarkets.json'; // adjust path if your JSON lives elsewhere
import connectDB from '@/config/database'
import HostFMarket from '@/models/HostFMarket'
import User from '@/models/User'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/utils/authOptions'

const HostFarmMarketsPage = async () => {
  await connectDB()

  // Get user session
  const session = await getServerSession(authOptions)
  let currentUser = null
  let userSavedMarkets = []

  if (session?.user?.email) {
    currentUser = await User.findOne({ email: session.user.email })
      .select('saved_markets')
      .lean()

    if (currentUser) {
      // Convert ObjectIds to strings for Client Components
      userSavedMarkets = (currentUser.saved_markets || []).map((id) =>
        id.toString()
      )
    }
  }

  let markets = []
  try {
    // Filter to only active markets per requirement.
    // const hostmarkets =  markets.find({ hostfm_active: true }).lean();
    // only active; change filter if you want all
    markets = await HostFMarket.find({ hostfm_active: true })
      .sort({ createdAt: -1 })
      .lean()
  } catch (error) {
    console.log('Error fetching markets:', error)
    markets = []
  }

  // Convert MongoDB ObjectIds to strings for Client Components
  const serializedMarkets = JSON.parse(JSON.stringify(markets))

  return (
    <>
      <SearchableMarketList
        initialMarkets={serializedMarkets}
        isLoggedIn={!!session?.user}
        userSavedMarkets={userSavedMarkets}
      />
    </>
  )
}

export default HostFarmMarketsPage
