//livloco-25\app\businesses\page.jsx

import connectDB from '@/config/database'
import LocoBiz from '@/models/LocoBiz'
import User from '@/models/User'
import SearchableBusinessList from '@/components/SearchableBusinessList'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/utils/authOptions'

const BusinessesPage = async () => {
  await connectDB()

  // Get user session
  const session = await getServerSession(authOptions)
  let currentUser = null
  let userSavedBusinesses = []

  if (session?.user?.email) {
    currentUser = await User.findOne({ email: session.user.email })
      .select('saved_businesses')
      .lean()

    if (currentUser) {
      // Convert ObjectIds to strings for Client Components
      userSavedBusinesses = (currentUser.saved_businesses || []).map((id) =>
        id.toString()
      )
    }
  }

  let locobizs = []
  try {
    locobizs = await LocoBiz.find({ locobiz_active: true }).lean()
  } catch (error) {
    console.log('Error fetching businesses:', error)
    locobizs = []
  }

  // Convert MongoDB ObjectIds to strings for Client Components
  const serializedLocobizs = JSON.parse(JSON.stringify(locobizs))

  return (
    <>
      <SearchableBusinessList
        initialBusinesses={serializedLocobizs}
        isLoggedIn={!!session?.user}
        userSavedBusinesses={userSavedBusinesses}
      />
    </>
  )
}

export default BusinessesPage
