'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import completeOnboardingAction from '@/app/actions/completeOnboardingAction';

const toE164 = (v) => {
  const d = String(v || '').replace(/\D/g, '').slice(0,10);
  return d ? `+1${d}` : '';
};

export default function OnboardingForm({ email }) {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [phoneDisplay, setPhoneDisplay] = useState('');
  const [alerts, setAlerts] = useState(false);
  const [choice, setChoice] = useState('none'); // 'none' | 'locobiz' | 'hostfmarket'

  const formatPhone = (s) => {
    const d = s.replace(/\D/g,'').slice(0,10);
    if (d.length < 4) return d;
    if (d.length < 7) return `(${d.slice(0,3)}) ${d.slice(3)}`;
    return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
  };

  const submit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.set('email', email);
    form.set('full_name', fullName.trim());
    form.set('phone', toE164(phoneDisplay));
    form.set('email_memmessage_notification', alerts ? 'true' : 'false');
    form.set('profile_choice', choice);

    const res = await completeOnboardingAction(form);
    if (res?.redirect) router.push(res.redirect);
    else router.push('/profile');
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <label className="block font-semibold mb-1">Email</label>
        <input type="email" value={email} readOnly className="border rounded w-full py-2 px-3 bg-gray-100" />
      </div>

      <div>
        <label htmlFor="full_name" className="block font-semibold mb-1">Your name</label>
        <input id="full_name" value={fullName} onChange={(e)=>setFullName(e.target.value)} required className="border rounded w-full py-2 px-3" />
      </div>

      <div>
        <label htmlFor="phone" className="block font-semibold mb-1">Phone (for 2-step)</label>
        <input id="phone" value={phoneDisplay} onChange={(e)=>setPhoneDisplay(formatPhone(e.target.value))} placeholder="(555) 123-4567" required className="border rounded w-full py-2 px-3" />
      </div>

      <label className="inline-flex items-center gap-2">
        <input type="checkbox" checked={alerts} onChange={(e)=>setAlerts(e.target.checked)} />
        <span>Email me when I get an in-app message</span>
      </label>

      <fieldset className="space-y-3">
        <legend className="font-semibold">Choose a profile type (optional)</legend>
        <label className="inline-flex items-center gap-2">
          <input type="radio" name="choice" value="none" checked={choice==='none'} onChange={()=>setChoice('none')} />
          <span>Skip for now</span>
        </label>
        <label className="block">
          <input type="radio" name="choice" value="locobiz" checked={choice==='locobiz'} onChange={()=>setChoice('locobiz')} /> LocoBusiness (one per user)
        </label>
        <label className="block">
          <input type="radio" name="choice" value="hostfmarket" checked={choice==='hostfmarket'} onChange={()=>setChoice('hostfmarket')} /> Hosted Farmers Market (one per user)
        </label>
      </fieldset>

      <button type="submit" className="rounded bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2">
        Save & Continue
      </button>
    </form>
  );
}
