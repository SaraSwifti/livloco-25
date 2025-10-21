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
    <section className='flex justify-center'>
      <div className='max-w-6xl w-full mx-auto px-4 py-10'>
        <div className='bg-white p-6 border rounded-lg shadow-md ring-1 ring-black/10 mb-6'>
          <h1 className='text-3xl font-bold text-center mb-2'>
            {user.full_name || 'User Profile'}
          </h1>
          <div className='text-center'>
            <MemberSince createdAt={user.createdAt} />
          </div>
          <p className='text-center text-gray-600'>{user.email}</p>
        </div>

        <ProfileNavBar user={user} />
      </div>
    </section>
  )
}
