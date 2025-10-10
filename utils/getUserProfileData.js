// utils/getUserProfileData.js
// Shared utility to fetch user profile data from session and database

import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import connectDB from '@/config/database';
import User from '@/models/User';

export async function getUserProfileData() {
  // 1) Get session
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null; // No authenticated user
  }

  const sessionUser = session.user;

  let userEmail = (sessionUser.email || '').toLowerCase();
  let userFullName = sessionUser.full_name || '';
  let userPhoneE164 = sessionUser.phone || '';

  // 2) Fallback to DB profile if session doesn't include these fields
  if (userEmail && (!userFullName || !userPhoneE164)) {
    await connectDB();
    const dbUser = await User.findOne({ email: userEmail })
      .select('full_name phone')
      .lean();

    if (dbUser) {
      if (!userFullName) userFullName = dbUser.full_name || '';
      if (!userPhoneE164) userPhoneE164 = dbUser.phone || '';
    }
  }

  return {
    userEmail,
    userFullName,
    userPhoneE164,
  };
}
