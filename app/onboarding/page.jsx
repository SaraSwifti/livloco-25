// app/onboarding/page.jsx
import { redirect } from 'next/navigation';
import connectDB from '@/config/database';
import User from '@/models/User';
import OnboardingForm from '@/components/OnboardingForm';
import { getSessionUser } from '@/utils/getSessionUser';

export default async function OnboardingPage() {
  const sess = await getSessionUser();
  if (!sess?.userEmail) redirect('/api/auth/signin'); // not signed in

  await connectDB();
  const user = await User.findOne({ email: sess.userEmail }).lean();

  // Already complete? Bounce them away.
  const complete = !!(user?.full_name && user?.phone);
  if (complete) redirect('/profile');

  return (
    <section className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Finish setting up your account</h1>
      <p className="text-gray-600 mb-6">
        We pre-filled your email. Add your name and phone for two-step, and choose a profile (or skip).
      </p>
      <OnboardingForm email={sess.userEmail} />
    </section>
  );
}

