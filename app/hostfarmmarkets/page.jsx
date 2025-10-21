import Hero from '@/components/Hero'
import SearchableMarketList from '@/components/SearchableMarketList'
// import markets from '@/app/hostfmarkets.json'; // adjust path if your JSON lives elsewhere
import connectDB from '@/config/database'
import HostFMarket from '@/models/HostFMarket'

const HostFarmMarketsPage = async () => {
  await connectDB()

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
      <Hero />
      <SearchableMarketList initialMarkets={serializedMarkets} />
    </>
  )
}

export default HostFarmMarketsPage
