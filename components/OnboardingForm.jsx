'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import completeOnboardingAction from '@/app/actions/completeOnboardingAction';
import AddBusLaterPopout from '@/components/AddBusLaterPopout';

const toE164 = (v) => {
  const d = String(v || '').replace(/\D/g, '').slice(0, 10);
  return d ? `+1${d}` : '';
};

export default function OnboardingForm({ email }) {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [phoneDisplay, setPhoneDisplay] = useState('');
  const [alerts, setAlerts] = useState(false);
  const [choice, setChoice] = useState('none'); // 'none' | 'locobiz' | 'hostfmarket'
  const [showSkipPopout, setShowSkipPopout] = useState(false);

  const formatPhone = (s) => {
    const d = s.replace(/\D/g, '').slice(0, 10);
    if (d.length < 4) return d;
    if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  };

  const submit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.set('email', email);
    form.set('full_name', fullName.trim());
    form.set('phone', toE164(phoneDisplay));
    form.set('email_memmessage_notification', alerts ? 'true' : 'false');
    // Always persist 'none' on onboarding regardless of radio selection
    form.set('profile_choice', 'none');

    await completeOnboardingAction(form);

    // Redirect logic is client-side only and does not change DB yet
    if (choice === 'none') {
      setShowSkipPopout(true);
      return;
    }
    if (choice === 'locobiz') return router.push('/businesses/add');
    if (choice === 'hostfmarket') return router.push('/hostfarmmarkets/add');
    return router.push('/businesses');
  };

  const inputCx =
    'w-full rounded-lg bg-gray-50 text-black placeholder-gray-500 ' +
    'border border-gray-700 py-2.5 px-3 shadow-sm ' +
    'focus:outline-none focus:ring-2 focus:ring-black focus:border-black shadow-md';

  return (
    <div className="bg-white text-black rounded-xl shadow-sm ring-1 ring-black/10 p-6">
      <form onSubmit={submit} className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-semibold">Email</label>
            <span className="text-xs text-gray-500">from your sign-in</span>
          </div>
          <input
            type="email"
            value={email}
            readOnly
            className={inputCx + ' bg-gray-100 cursor-not-allowed'}
          />
        </div>

        <div>
          <label htmlFor="full_name" className="block font-semibold mb-1">
            Your name <span className="text-red-600">*</span>
          </label>
          <input
            id="full_name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoComplete="name"
            placeholder="First and last name"
            className={inputCx}
          />
        </div>

        <div>
          <label htmlFor="phone" className="block font-semibold mb-1">
            Phone (for 2-step) <span className="text-red-600">*</span>
          </label>
          <input
            id="phone"
            value={phoneDisplay}
            onChange={(e) => setPhoneDisplay(formatPhone(e.target.value))}
            placeholder="(555) 123-4567"
            required
            inputMode="tel"
            autoComplete="tel"
            className={inputCx}
          />
          <p className="mt-1 text-xs text-gray-500">
            We store this as +1XXXXXXXXXX to support verification.
          </p>
        </div>

        <div className="bg-gray-50/80 rounded-lg border border-gray-200 p-3">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={alerts}
              onChange={(e) => setAlerts(e.target.checked)}
              className="h-4 w-4 accent-black"
            />
            <span>Email me when I get an in-app message</span>
          </label>
        </div>

        <fieldset className="bg-gray-50/80 rounded-lg border border-gray-200 p-3 space-y-3">
          <legend className="font-semibold px-1">Choose a profile type (optional)</legend>

          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="choice"
              value="none"
              checked={choice === 'none'}
              onChange={() => setChoice('none')}
              className="h-4 w-4 accent-black"
            />
            <span>Skip for now. I want to be a Livloco Co-op member and just peruse</span>
          </label>

          <label className="block">
            <input
              type="radio"
              name="choice"
              value="locobiz"
              checked={choice === 'locobiz'}
              onChange={() => setChoice('locobiz')}
              className="mr-2 h-4 w-4 align-middle accent-black"
            />
            <span className="align-middle">LocoBusiness (one per user)</span>
          </label>

          <label className="block">
            <input
              type="radio"
              name="choice"
              value="hostfmarket"
              checked={choice === 'hostfmarket'}
              onChange={() => setChoice('hostfmarket')}
              className="mr-2 h-4 w-4 align-middle accent-black"
            />
            <span className="align-middle">Hosted Farmers Market (one per user)</span>
          </label>
        </fieldset>

        <div className="text-sm text-gray-500">
          <h1 className="text-3xl font-bold">Placeholder for payment method</h1>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-black hover:bg-black/90 text-white font-semibold py-3"
          title="Save & Continue"
        >
          Save & Continue
        </button>
      </form>

      {showSkipPopout && (
        <AddBusLaterPopout
          onClose={() => {
            setShowSkipPopout(false);
            // Redirect to businesses page after closing popout
            router.push('/businesses');
          }}
        />
      )}
    </div>
  );
}
