import HomeHeader from '@/components/HomeHeader'
import MoreLessHero from '@/components/MoreLessHero'
import AboutBox from '@/components/AboutBox'

const HomePage = async () => {
  return (
    <>
      <HomeHeader />
      <div className='mb-8' />
      <MoreLessHero />
      <AboutBox />

      {/* <NewMemLocal /> */}
    </>
  )
}

export default HomePage
