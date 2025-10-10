// app/hostfarmmarkets/add/page.jsx

import HostMarketsAddForm from '@/components/HostMarketsAddForm';
import { getUserProfileData } from '@/utils/getUserProfileData';
import { redirect } from 'next/navigation';

const AddHostMarketPage = async () => {
  // Get user profile data (includes auth check)
  const userData = await getUserProfileData();

  // Redirect to sign-in if not authenticated
  if (!userData) {
    redirect('/api/auth/signin?callbackUrl=/hostfarmmarkets/add');
  }

  const { userEmail, userFullName, userPhoneE164 } = userData;

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <HostMarketsAddForm
        userEmail={userEmail}
        userFullName={userFullName}
        userPhoneE164={userPhoneE164}
      />
    </section>
  );
};

export default AddHostMarketPage;
