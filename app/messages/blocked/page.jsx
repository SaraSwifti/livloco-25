import { Suspense } from 'react'
import MessagesNavBar from '@/components/MessagesNavBar'
import BlockedUsersList from '@/components/BlockedUsersList'
import { getSessionUser } from '@/utils/getSessionUser'
import { redirect } from 'next/navigation'

const BlockedUsersPage = async () => {
  const sessionUser = await getSessionUser()

  if (!sessionUser?.userId) {
    redirect('/api/auth/signin')
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <MessagesNavBar />
      <Suspense
        fallback={
          <div className='flex items-center justify-center h-64'>
            <div className='text-gray-500'>Loading...</div>
          </div>
        }
      >
        <BlockedUsersList currentUserId={sessionUser.userId} />
      </Suspense>
    </div>
  )
}

export default BlockedUsersPage
