
//livloco-25\app\businesses\page.jsx


import Hero from '@/components/Hero';

import connectDB from '@/config/database';
import LocoBiz from '@/models/LocoBiz';
import BusinessCard from '@/components/BusinessCard';

const BusinessesPage = async () => {
    await connectDB();
    
    let locobizs = [];
    try {
        locobizs = await LocoBiz.find({ locobiz_active: true }).lean();
    } catch (error) {
        console.log('Error fetching businesses:', error);
        locobizs = [];
    }

   // Convert MongoDB ObjectIds to strings for Client Components
   const serializedLocobizs = JSON.parse(JSON.stringify(locobizs));

  return (
    <>
      <Hero />
      <section className='px-4 py-6'>
        <div className='container-xl lg:container m-auto px-4 py-6'>
          {serializedLocobizs.length === 0 ? (
            <p> No Businesses found </p>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>

                 {serializedLocobizs.map((locobiz) => (
                <BusinessCard
                  key={locobiz._id}
                  locobiz={locobiz}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default BusinessesPage;
