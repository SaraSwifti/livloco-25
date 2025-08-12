
import Hero from '@/components/Hero';
import MarketCard from '@/components/MarketCard';
import markets from '@/app/hostfarmmarkets/hostfmarkets.json'; // adjust path if your JSON lives elsewhere

const HostFarmMarketsPage = async () => {
      // Filter to only active markets per requirement.
    const activeMarkets = (markets || []).filter((m) => m?.hostfm_active === true);
    
    return ( 
        <>
        <Hero />
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto px-4 py-6">
          {activeMarkets.length === 0 ? (
            <p>No Host Farm Markets found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {markets.filter(m => m.hostfm_active).map(m => (
                <MarketCard key={markets.id ?? `${markets.hostfm_name}-${markets.email}`} market={markets} />
              ))}
            </div>
          )}
        </div>
            </section>
            </>
     );
}
 
export default HostFarmMarketsPage;