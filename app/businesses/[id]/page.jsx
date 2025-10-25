///app/businesses/[id]/page.jsx
import mongoose from 'mongoose'

import BusinessHeaderImage from '@/components/BusinessHeaderImage'
import BusinessDetails from '@/components/BusinessDetails'
// import BusinessContact from '@/components/BusinessContact';
import connectDB from '@/config/database'
import LocoBiz from '@/models/LocoBiz'
import User from '@/models/User'
import Link from 'next/link'
import { notFound } from 'next/navigation' // Optional for handling missing business
import { FaArrowLeft } from 'react-icons/fa'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/utils/authOptions'

const BusinessPage = async ({ params }) => {
  const { id } = await params
  await connectDB()
  const doc = await LocoBiz.findById(id).populate('owner').lean()

  // Convert MongoDB ObjectIds to strings for Client Components
  const locobiz = doc ? JSON.parse(JSON.stringify(doc)) : null

  // Get current user session to check if they've voted and saved
  const session = await getServerSession(authOptions)
  let currentUser = null
  let hasVoted = false
  let hasSaved = false

  if (session?.user?.email) {
    currentUser = await User.findOne({ email: session.user.email })
      .select('_id voted_businesses saved_businesses')
      .lean()

    if (currentUser && doc) {
      hasVoted =
        currentUser.voted_businesses?.some(
          (businessId) => businessId.toString() === id
        ) || false

      hasSaved =
        currentUser.saved_businesses?.some(
          (businessId) => businessId.toString() === id
        ) || false
    }
  }
  //  // Optional: Guard against bad MongoDB ObjectId

  //  if (!mongoose.Types.ObjectId.isValid(params.id)) {
  //    return notFound(); // or render your fallback UI here
  //  }

  // If business not found, show fallback UI or redirect
  if (!locobiz) {
    return (
      <div className='text-center py-10 border-4 border-black '>
        <h2 className='text-2xl font-semibold'>Business not found</h2>
        <Link
          href='/businesses'
          className='text-blue-600 underline mt-4 inline-block'
        >
          Back to Livloco Listings
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section with Gradient Background */}
      <section className='relative w-full'>
        <div className='relative'>
          <BusinessHeaderImage locobiz={locobiz} />

          {/* Gradient overlay */}
          <div className='absolute inset-0 bg-gradient-to-b from-black/30 to-transparent pointer-events-none' />

          {/* Back Button */}
          <div className='absolute top-4 left-4 z-10'>
            <Link
              href='/businesses'
              className='inline-flex items-center bg-white/90 hover:bg-white px-4 py-2 text-lg font-semibold text-gray-900 shadow-lg rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-800'
              aria-label='Back to business listings'
            >
              <FaArrowLeft
                className='mr-2'
                aria-hidden='true'
              />
              Back to Listings
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <main className='bg-white min-h-screen'>
        <div className='max-w-7xl mx-auto px-4 py-8'>
          <BusinessDetails
            locobiz={locobiz}
            voteData={{
              id: id,
              voteCount: locobiz.locobiz_votes?.length || 0,
              hasVoted: hasVoted,
              isLoggedIn: !!session?.user,
            }}
            saveData={{
              id: id,
              hasSaved: hasSaved,
              isLoggedIn: !!session?.user,
            }}
            messageButtonProps={
              session?.user &&
              currentUser &&
              locobiz?.owner &&
              currentUser._id.toString() !== locobiz.owner._id.toString()
                ? {
                    postingType: 'business',
                    postingId: id,
                    recipientId: locobiz.owner._id.toString(),
                    postingName: locobiz.locobiz_name,
                    currentUserId: currentUser._id.toString(),
                  }
                : null
            }
          />
        </div>
      </main>
    </>
  )
}
export default BusinessPage
