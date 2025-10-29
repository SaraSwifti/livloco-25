import { Suspense } from 'react'
import MessagesNavBar from '@/components/MessagesNavBar'
import MessageList from '@/components/MessageList'
import { getSessionUser } from '@/utils/getSessionUser'
import { redirect } from 'next/navigation'
import connectDB from '@/config/database'

const MessagesPage = async () => {
  const sessionUser = await getSessionUser()

  if (!sessionUser?.userId) {
    redirect('/api/auth/signin')
  }

  // Fetch user data for the NavBar
  const User = (await import('@/models/User')).default
  await connectDB()
  const user = await User.findById(sessionUser.userId).lean()

  return (
    <div className='min-h-screen bg-gray-50'>
      <MessagesNavBar user={user} />
      <Suspense
        fallback={
          <div className='flex items-center justify-center h-64'>
            <div className='text-gray-500'>Loading...</div>
          </div>
        }
      >
        <MessageList currentUserId={sessionUser.userId} />
      </Suspense>
    </div>
  )
}

export default MessagesPage
