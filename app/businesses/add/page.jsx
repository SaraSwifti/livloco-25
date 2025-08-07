
// import connectDB from '@/config/database';
// import User from '@/models/User';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';

import BusinessAddForm from "@/components/BusinessAddForm.jsx";



const AddBusinessPage = async ({ params }) => {

//  await connectDB();
//     const user = await User.findById(params.id).lean();
    //     const userEmail = user?.email || '';
    
      const session = await getServerSession(authOptions);

    const userEmail = session?.user?.email || '';
   

  return (
      <section className=''>
          <div className="container m-auto  max-w-2xl py-24">
              <div className="bg-white px-6 py-8 mb-4 rounded-md shadow-md border m-4 md:m-0">
                  <BusinessAddForm userEmail={userEmail}  />
                
                  
                
              </div>
             



          </div>
      </section>
  );
};

export default AddBusinessPage;
