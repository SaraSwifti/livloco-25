// app/profile/[id]/page.jsx
import { notFound, redirect } from 'next/navigation'
import mongoose from 'mongoose'
import { getServerSession } from 'next-auth'

import connectDB from '@/config/database'
import User from '@/models/User'
import LocoBiz from '@/models/LocoBiz' // Import LocoBiz to ensure it's registered
import { authOptions } from '@/utils/authOptions'
import ProfileNavBar from '@/components/ProfileNavBar'
import MemberSince from '@/components/MemberSince'

export default async function UserProfilePage(props) {
  const { id } = await props.params

  // Guard invalid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) return notFound()

  // Get session to verify user is viewing their own profile
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/')
  }

  await connectDB()

  // Fetch user data
  const userDoc = await User.findById(id)
    .populate('locobiz')
    .populate('hostfmarket')
    .lean()

  if (!userDoc) return notFound()

  // Convert to plain object for client components
  const user = JSON.parse(JSON.stringify(userDoc))

  // Verify user is viewing their own profile
  const sessionEmail = (session.user.email || '').toLowerCase()
  const profileEmail = (user.email || '').toLowerCase()

  if (sessionEmail !== profileEmail) {
    redirect('/')
  }

  return (
    <div className='-mx-4 -mt-8'>
      {/* Hero Section with Profile Header */}
      <section className='mb-4 relative'>
        <div className='livloco-hero'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center relative z-10'>
            {/* Profile Header Content */}
            <div className='text-center'>
              <h1 className='livloco-hero-title mb-2'>
                {user.full_name || 'User Profile'}
              </h1>
              <div className='livloco-text-white mb-2'>
                <MemberSince createdAt={user.createdAt} />
              </div>
              <p className='livloco-hero-subtitle'>{user.email}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className='max-w-6xl mx-auto px-4 py-6 mt-8 bg-white'>
        <ProfileNavBar user={user} />
      </div>
    </div>
  )
}
