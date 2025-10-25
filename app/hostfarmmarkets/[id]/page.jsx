// app/hostfarmmarkets/[id]/page.jsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'
import mongoose from 'mongoose'

import connectDB from '@/config/database'
import HostFMarket from '@/models/HostFMarket'
import User from '@/models/User'

import HostFMHeaderImage from '@/components/HostFMHeaderImage'
import MarketDetails from '@/components/MarketDetails'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/utils/authOptions'

// helpers
const toBool = (v) =>
  v === true ||
  (typeof v === 'string' && v.trim().toLowerCase() === 'true') ||
  v === 1

const normalizeUrl = (u) => {
  if (!u) return ''
  if (/^https?:\/\//i.test(u)) return u
  return `https://${u}`
}

export default async function HostFarmMarketPage(props) {
  // ✅ 1) Await params to satisfy Next's dynamic API rule
  const { id } = await props.params

  // ✅ 2) Guard invalid ObjectId (avoids CastError)
  if (!mongoose.Types.ObjectId.isValid(id)) return notFound()

  await connectDB()

  // ✅ 3) Fetch and JSON-safe the doc to avoid passing ObjectId/Date to client comps
  const doc = await HostFMarket.findById(id).populate('owner').lean()
  if (!doc) return notFound()

  // Convert ObjectId/Date → strings/primitives
  const market = JSON.parse(JSON.stringify(doc))

  // Get current user session to check if they've voted and saved
  const session = await getServerSession(authOptions)
  let currentUser = null
  let hasVoted = false
  let hasSaved = false

  if (session?.user?.email) {
    currentUser = await User.findOne({ email: session.user.email })
      .select('_id voted_markets saved_markets')
      .lean()

    if (currentUser && doc) {
      hasVoted =
        currentUser.voted_markets?.some(
          (marketId) => marketId.toString() === id
        ) || false

      hasSaved =
        currentUser.saved_markets?.some(
          (marketId) => marketId.toString() === id
        ) || false
    }
  }

  return (
    <>
      {/* Hero Section with Gradient Background */}
      <section className='relative w-full'>
        <div className='relative'>
          <HostFMHeaderImage market={market} />

          {/* Gradient overlay */}
          <div className='absolute inset-0 bg-gradient-to-b from-black/30 to-transparent pointer-events-none' />

          {/* Back Button */}
          <div className='absolute top-4 left-4 z-10'>
            <Link
              href='/hostfarmmarkets'
              className='inline-flex items-center bg-white/90 hover:bg-white px-4 py-2 text-lg font-semibold text-gray-900 shadow-lg rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-700'
              aria-label='Back to market listings'
            >
              <FaArrowLeft
                className='mr-2'
                aria-hidden='true'
              />
              Back to Markets
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <main className='bg-white min-h-screen'>
        <div className='max-w-7xl mx-auto px-4 py-8'>
          <MarketDetails
            market={market}
            voteData={{
              id: id,
              voteCount: market.hostfm_votes?.length || 0,
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
              market?.owner &&
              currentUser._id.toString() !== market.owner._id.toString()
                ? {
                    postingType: 'hostfarmmarket',
                    postingId: id,
                    recipientId: market.owner._id.toString(),
                    postingName: market.hostfm_name,
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
