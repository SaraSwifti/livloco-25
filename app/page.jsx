
import HomeHeader from '@/components/HomeHeader';
import AboutPage from '@/components/AboutPage';
// import CurrentStatsBox from '@/components/CurrentStatsBox';
// import NewMemLocal from '@/components/NewMemLocal';
// import connectDB from '@/config/database';
// import LocoMem from "@/models/LocoMem";

const HomePage = async () => {
    // await connectDB();
    
    
    //   const recentMems = await LocoMem.find({})
    //     .sort({ createdAt: -1 })
    //     .limit(3)
    //     .lean();
    
   
    return ( 
        <>
            
            <HomeHeader />
            <AboutPage />
            {/* {recentMems.length === 0 ? (
                <p>No Recent Loco Members Found</p>
            ) : (
                recentMems.map((LocoMem) => (
                   <CurrentStatsBox key={LocoMem._id} locomem={Locomem} />
               ))    
            )} */}
           
            {/* <NewMemLocal /> */}
        </>
     );
}
 
export default HomePage;