// app/businesses/edit/page.jsx

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import connectDB from '@/config/database';
import LocoBiz from '@/models/LocoBiz';
import User from '@/models/User';
import { authOptions } from '@/utils/authOptions';
import BusinessEditForm from '@/components/BusinessEditForm';

export default async function EditBusinessPage() {
  // Get session to verify user is authenticated
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/api/auth/signin?callbackUrl=/businesses/edit');
  }

  await connectDB();

  // Find user and their business
  const userEmail = (session.user.email || '').toLowerCase();
  const user = await User.findOne({ email: userEmail }).lean();

  if (!user) {
    redirect('/');
  }

  // Check if user has a business
  if (!user.locobiz) {
    redirect('/businesses/add');
  }

  // Fetch the business data
  const business = await LocoBiz.findById(user.locobiz).lean();

  if (!business) {
    redirect('/businesses/add');
  }

  // Convert to plain object for client components
  const businessData = JSON.parse(JSON.stringify(business));
  const userData = {
    email: user.email,
    full_name: user.full_name,
    phone: user.phone,
  };

  return (
    <section>
      <div className="container m-auto max-w-2xl py-24">
        <div className="bg-white px-6 py-8 mb-4 rounded-md shadow-md border m-4 md:m-0">
          <BusinessEditForm
            businessData={businessData}
            userEmail={userData.email}
            userFullName={userData.full_name}
            userPhoneE164={userData.phone}
          />
        </div>
      </div>
    </section>
  );
}
