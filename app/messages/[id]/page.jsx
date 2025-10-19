import { Suspense } from 'react'
import MessagesNavBar from '@/components/MessagesNavBar'
import MessageThread from '@/components/MessageThread'
import { getSessionUser } from '@/utils/getSessionUser'
import { redirect } from 'next/navigation'

const MessageThreadPage = async ({ params }) => {
  const sessionUser = await getSessionUser()
  const { id } = await params

  if (!sessionUser?.userId) {
    redirect('/api/auth/signin')
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <MessagesNavBar />
      <Suspense
        fallback={
          <div className='flex items-center justify-center h-64'>
            <div className='text-gray-500'>Loading conversation...</div>
          </div>
        }
      >
        <MessageThread
          threadId={id}
          currentUserId={sessionUser.userId}
        />
      </Suspense>
    </div>
  )
}

export default MessageThreadPage
