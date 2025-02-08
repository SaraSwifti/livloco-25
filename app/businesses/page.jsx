import Hero from '@/components/Hero';
// import locomems from '@/app/locomems.json';
import connectDB from '@/config/database';
import LocoMem from '@/models/LocoMem';
import BusinessCard from '@/components/BusinessCard';


const BusinessesPage = async () => {
    await connectDB();
    const locomems = await LocoMem.find({}).lean();
    return ( 
        <>
            <Hero />
            <section className='px-4 py-6'>
                <div className='container-xl lg:container m-auto px-4 py-6' >
                    {locomems.length === 0 ? (<p> No Businesses found </p>) : (
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            {locomems.map((locomem) => (
                        <BusinessCard key={locomem._id} locomem={locomem} />
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