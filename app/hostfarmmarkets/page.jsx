
import Hero from '@/components/Hero';
import MarketCard from '@/components/MarketCard';
// import markets from '@/app/hostfmarkets.json'; // adjust path if your JSON lives elsewhere
import connectDB from '@/config/database';
import HostFMarket from '@/models/HostFMarket';

const HostFarmMarketsPage = async () => {
  await connectDB();
      // Filter to only active markets per requirement.
    // const hostmarkets =  markets.find({ hostfm_active: true }).lean();
     // only active; change filter if you want all
  const markets = await HostFMarket
    .find({ hostfm_active: true })
    .sort({ createdAt: -1 })
    .lean();

  // Convert MongoDB ObjectIds to strings for Client Components
  const serializedMarkets = JSON.parse(JSON.stringify(markets));

    return ( 
        <>
        <Hero />
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto px-4 py-6">
          {serializedMarkets.length === 0 ? (
            <p>No Livloco Host Farm Markets found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serializedMarkets.map((market) => (
                                <MarketCard
                                    key={market._id}
                                    market={market} />
              ))}
            </div>
          )}
        </div>
            </section>
            </>
     )
}
 
export default HostFarmMarketsPage;