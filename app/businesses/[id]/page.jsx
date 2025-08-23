
///app/businesses/[id]/page.jsx
import mongoose from 'mongoose';

import BusinessHeaderImage from '@/components/BusinessHeaderImage';
import BusinessDetails from '@/components/BusinessDetails';
// import BusinessContact from '@/components/BusinessContact';
import connectDB from "@/config/database";
import LocoBiz from '@/models/LocoBiz';
import Link from 'next/link';
import { notFound } from 'next/navigation'; // Optional for handling missing business
import { FaArrowLeft } from 'react-icons/fa';
 
const BusinessPage = async ({ params }) => {
 const { id } = await params;
  await connectDB();
const locobiz = await LocoBiz.findById(id).lean(); 
  //  // Optional: Guard against bad MongoDB ObjectId

  //  if (!mongoose.Types.ObjectId.isValid(params.id)) {
  //    return notFound(); // or render your fallback UI here
  //  }


    // If business not found, show fallback UI or redirect
  if (!locobiz) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold">Business not found</h2>
        <Link href="/businesses" className="text-blue-600 underline mt-4 inline-block">
          Back to Listings
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full">
  <BusinessHeaderImage locobiz={locobiz} />

  {/* dim layer */}
  {/* bottom dim layer for readability */}
<div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

<h1
  className="
    absolute
    left-4 sm:left-6 md:left-10
    bottom-4 sm:bottom-6 md:bottom-8
    z-10
    text-left
    text-white font-bold text-5xl md:text-7xl
    [-webkit-text-stroke:1.5px_black]
    [text-shadow:_-1px_0_#000,0_1px_#000,1px_0_#000,0_-1px_#000,_-1px_-1px_0_#000,1px_1px_0_#000,-1px_1px_0_#000,1px_-1px_0_#000]
    pointer-events-none
  "
>
  {locobiz.locobiz_name}
</h1>

</div>

      <section>
        {/* Go Back Arrow */}
        
               <button
        type="button"
        className="rounded-md bg-white/70 px-3.5 py-2.5 text-lg m-5 font-semibold text-white shadow-sm hover:bg-white"
      >         
          <Link
            href="/businesses"
            className="text-black hover:text-xl flex items-center"
          >
            <FaArrowLeft className='mr-2' /> Back to Co-op Listings
            </Link>
            </button>
        
      </section>
      <section className="flex items-start justify-center py-10">
        <div className="container m-auto py-10 px-6 ">
          <div className="grid grid-cols-1 mb-5  md:grid-cols-70/30 w-full gap-6">
            {/*Co-op mem business info*/}
            <BusinessDetails locobiz={locobiz} />
             <section>
        {/* Go Back Arrow */}
        
               <button
        type="button"
        className="rounded-md bg-white/70 px-3.5 py-2.5 text-lg m-5 font-semibold text-white shadow-sm hover:bg-white"
      >         
          <Link
            href="/businesses"
            className="text-black hover:text-xl flex items-center"
          >
            <FaArrowLeft className='mr-2' /> Back to Co-op Listings
            </Link>
            </button>
        
      </section>
            {/* <BusinessContact locobiz={locobiz} /> */}
            
          </div>
           
        </div>
      </section>

    </>
  );
  
};
export default BusinessPage;