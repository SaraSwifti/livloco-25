// app/hostfarmmarkets/edit/page.jsx

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import connectDB from '@/config/database';
import HostFMarket from '@/models/HostFMarket';
import User from '@/models/User';
import { authOptions } from '@/utils/authOptions';
import HostMarketEditForm from '@/components/HostMarketEditForm';

export default async function HostFarmMarketEditPage() {
  // Get session to verify user is authenticated
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/api/auth/signin?callbackUrl=/hostfarmmarkets/edit');
  }

  await connectDB();

  // Find user and their market
  const userEmail = (session.user.email || '').toLowerCase();
  const user = await User.findOne({ email: userEmail }).lean();

  if (!user) {
    redirect('/');
  }

  // Check if user has a market
  if (!user.hostfmarket) {
    redirect('/hostfarmmarkets/add');
  }

  // Fetch the market data
  const market = await HostFMarket.findById(user.hostfmarket).lean();

  if (!market) {
    redirect('/hostfarmmarkets/add');
  }

  // Convert to plain object for client components
  const marketData = JSON.parse(JSON.stringify(market));
  const userData = {
    email: user.email,
    full_name: user.full_name,
    phone: user.phone,
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <HostMarketEditForm
        marketData={marketData}
        userEmail={userData.email}
      />
    </section>
  );
}
