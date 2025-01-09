import Hero from '@/components/Hero';
import businesses from '@/app/locomems.json';
import BusinessCard from '@/components/BusinessCard';
const BusinessesPage = () => {
    return ( 
        <>
            <Hero />
            <section className='px-4 py-6'>
                <div className='container-xl lg:container m-auto px-4 py-6' >
                    {businesses.length === 0 ? (<p> No Businesses found </p>) : (
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            {businesses.map((business) => (
                        <BusinessCard key={business._id} business={business} />
                        ))}     
                     </div>   
                    )
                    }
                </div>
            </section>

        </>
     );
}
 
export default BusinessesPage;