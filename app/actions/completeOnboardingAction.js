// app/actions/completeOnboardingAction.js
'use server';

import connectDB from '@/config/database';
import User from '@/models/User';
import LocoBiz from '@/models/LocoBiz';
import HostFMarket from '@/models/HostFMarket';
import { getSessionUser } from '@/utils/getSessionUser';

const toBool = (x) => x === true || String(x).toLowerCase() === 'true';

export default async function completeOnboardingAction(form) {
  await connectDB();

  const sess = await getSessionUser();
  if (!sess?.userEmail) return { redirect: '/' };

  const email = sess.userEmail;
  const full_name = String(form.get('full_name') || '').trim();
  const phone = String(form.get('phone') || ''); // already E.164 from client
  const emailAlerts = toBool(form.get('email_memmessage_notification'));
  const profile_choice = String(form.get('profile_choice') || 'none');

  // Upsert & store onboarding info
  const user = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        full_name,
        phone,
        email_memmessage_notification: emailAlerts,
        profile_choice,
      },
    },
    { new: true, upsert: true }
  );

  // Optional: steer to chosen creation flow if not already owned
  if (profile_choice === 'locobiz') {
    const existingFM = await HostFMarket.findOne({ owner: user._id }).lean();
    if (!existingFM && !user.locobiz) return { redirect: '/businesses/add' };
  }
  if (profile_choice === 'hostfmarket') {
    const existingBiz = await LocoBiz.findOne({ owner: user._id }).lean();
    if (!existingBiz && !user.hostfmarket) return { redirect: '/hostfarmmarkets/add' };
  }

  return { redirect: '/profile' };
}

