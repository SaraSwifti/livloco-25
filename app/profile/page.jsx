// app/profile/page.jsx

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import connectDB from '@/config/database';
import User from '@/models/User';
import { authOptions } from '@/utils/authOptions';

export default async function ProfilePage() {
  // Get session to verify user is authenticated
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  await connectDB();

  // Find user by email and redirect to their profile/[id] page
  const userEmail = (session.user.email || '').toLowerCase();
  const user = await User.findOne({ email: userEmail }).select('_id').lean();

  if (!user) {
    redirect('/');
  }

  // Redirect to the user's specific profile page
  redirect(`/profile/${user._id}`);
}