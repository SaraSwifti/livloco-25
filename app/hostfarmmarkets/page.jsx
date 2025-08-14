
import Hero from '@/components/Hero';
import MarketCard from '@/components/MarketCard';
import markets from '@/app/hostfmarkets.json'; // adjust path if your JSON lives elsewhere

const HostFarmMarketsPage =  () => {
      // Filter to only active markets per requirement.
    // const hostmarkets =  markets.find({ hostfm_active: true }).lean();
    
    return ( 
        <>
        <Hero />
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto px-4 py-6">
          {markets.length === 0 ? (
            <p>No Livloco Host Farm Markets found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {markets.map((market) => (
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