// app/businesses/add/page.jsx

import BusinessAddForm from '@/components/BusinessAddForm.jsx';
import { getUserProfileData } from '@/utils/getUserProfileData';
import { redirect } from 'next/navigation';

export default async function AddBusinessPage() {
  // Get user profile data (includes auth check)
  const userData = await getUserProfileData();

  // Redirect to sign-in if not authenticated
  if (!userData) {
    redirect('/api/auth/signin?callbackUrl=/businesses/add');
  }

  const { userEmail, userFullName, userPhoneE164 } = userData;

  return (
    <section>
      <div className="container m-auto max-w-2xl py-24">
        <div className="bg-white px-6 py-8 mb-4 rounded-md shadow-md border m-4 md:m-0">
          <BusinessAddForm
            userEmail={userEmail}
            userFullName={userFullName}
            userPhoneE164={userPhoneE164}
          />
        </div>
      </div>
    </section>
  );
}
