import BusinessHeaderImage from '@/components/BusinessHeaderImage';
import BusinessDetails from '@/components/BusinessDetails';
// import FarmMarket from '@/components/FarmMarket';
import BusinessContact from '@/components/BusinessContact';
import connectDB from "@/config/database";
import LocoMem from '@/models/LocoMem';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

const BusinessPage = async ({ params }) => {
    await connectDB();
    const locomem = await LocoMem.findById(params.id).lean();

  return (
    <>
      <div className="relative w-full">
        <BusinessHeaderImage image={locomem.locobiz_profile_image} />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-white text-7xl font-bold">{locomem.locobiz_name}</h1>
        </div>
           
      </div>
      <section>
        {/* Go Back Arrow */}
        <div className="bg-white container m-auto py-6 px-6">
                    
          <Link
            href="/businesses"
            className="text-black hover:text-xl flex items-center"
          >
            <FaArrowLeft className='mr-2' /> Back to Co-op Listing
          </Link>
        </div>
      </section>
      <section className='flex items-center justify-center h-screen'>
        <div className="container m-auto py-10 px-6 ">
          <div className="grid grid-cols-1 mb-5  md:grid-cols-70/30 w-full gap-6">
            {/*Co-op mem business info*/}
            <BusinessDetails locomem={locomem} />
            <BusinessContact locomem={locomem} />
            
          </div>
           
        </div>
      </section>

    </>
  );
  
};
export default BusinessPage;