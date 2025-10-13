
///app/businesses/[id]/page.jsx
import mongoose from 'mongoose';

import BusinessHeaderImage from '@/components/BusinessHeaderImage';
import BusinessDetails from '@/components/BusinessDetails';
// import BusinessContact from '@/components/BusinessContact';
import connectDB from "@/config/database";
import LocoBiz from '@/models/LocoBiz';
import User from '@/models/User';
import Link from 'next/link';
import { notFound } from 'next/navigation'; // Optional for handling missing business
import { FaArrowLeft } from 'react-icons/fa';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';

const BusinessPage = async ({ params }) => {
 const { id } = await params;
  await connectDB();
const locobiz = await LocoBiz.findById(id).lean();

  // Get current user session to check if they've voted
  const session = await getServerSession(authOptions);
  let currentUser = null;
  let hasVoted = false;

  if (session?.user?.email) {
    currentUser = await User.findOne({ email: session.user.email })
      .select('_id voted_businesses')
      .lean();

    if (currentUser && locobiz) {
      hasVoted = currentUser.voted_businesses?.some(
        (businessId) => businessId.toString() === id
      ) || false;
    }
  } 
  //  // Optional: Guard against bad MongoDB ObjectId

  //  if (!mongoose.Types.ObjectId.isValid(params.id)) {
  //    return notFound(); // or render your fallback UI here
  //  }


    // If business not found, show fallback UI or redirect
  if (!locobiz) {
    return (
      <div className="text-center py-10 border-4 border-black ">
        <h2 className="text-2xl font-semibold">Business not found</h2>
        <Link href="/businesses" className="text-blue-600 underline mt-4 inline-block">
          Back to Livloco Listings
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full">
  <BusinessHeaderImage locobiz={locobiz} />

  {/* dim layer */}
  <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />




</div>

      <section>
        {/* Go Back Arrow */}
        <div className="flex items-center justify-between m-5">
               <button
        type="button"
        className="border-4 border-black rounded-md bg-white/70 px-3.5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-white"
      >
          <Link
            href="/businesses"
            className="text-black hover:text-xl flex items-center"
          >
            <FaArrowLeft className='mr-2' /> Back to LocoBusiness Listings
            </Link>
            </button>
        </div>

      </section>
      <section className="flex items-start justify-center">
        <div className="container m-auto py-10 px-6 ">
          <div className="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6 border-4 border-black ">
            {/*Co-op mem business info*/}
            <BusinessDetails
              locobiz={locobiz}
              voteData={{
                id: id,
                voteCount: locobiz.locobiz_votes?.length || 0,
                hasVoted: hasVoted,
                isLoggedIn: !!session?.user
              }}
            />
             <section>
        {/* Go Back Arrow */}
     
        
      </section>
            {/* <BusinessContact locobiz={locobiz} /> */}
            
          </div>
              
               <button
        type="button"
        className="border-4 border-black rounded-md bg-white/70 px-3.5 py-2.5 text-lg m-5 font-semibold text-white shadow-sm hover:bg-white"
      >         
          <Link
            href="/businesses"
            className="text-black hover:text-xl flex items-center"
          >
            <FaArrowLeft className='mr-2' /> Back to Co-op Listings
            </Link>
            </button>
        </div>
      </section>

    </>
  );
  
};
export default BusinessPage;