//livloco-25\app\businesses\page.jsx

import Hero from '@/components/Hero'
import connectDB from '@/config/database'
import LocoBiz from '@/models/LocoBiz'
import SearchableBusinessList from '@/components/SearchableBusinessList'

const BusinessesPage = async () => {
  await connectDB()

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
      <Hero />
      <SearchableBusinessList initialBusinesses={serializedLocobizs} />
    </>
  )
}

export default BusinessesPage
