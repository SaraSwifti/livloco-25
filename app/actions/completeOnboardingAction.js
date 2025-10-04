// app/actions/completeOnboardingAction.js
'use server';

import connectDB from '@/config/database';
import User from '@/models/User';

export default async function completeOnboardingAction(formData) {
  await connectDB();
  const email  = formData.get('email');
  const name   = formData.get('full_name');
  const phone  = formData.get('phone');
  const alerts = String(formData.get('email_memmessage_notification') || '').toLowerCase() === 'true';

  // Per the new flow, ALWAYS set profile_choice to 'none' during onboarding
  await User.updateOne(
    { email },
    { $set: { full_name: name, phone, email_memmessage_notification: alerts, profile_choice: 'none' } },
    { upsert: false }
  );

  return { ok: true };
}
