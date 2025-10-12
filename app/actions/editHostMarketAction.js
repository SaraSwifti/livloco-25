// app/actions/editHostMarketAction.js
'use server';

import connectDB from '@/config/database';
import HostFMarket from '@/models/HostFMarket';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const MAX_DATES = 6;

const toE164 = (display) => {
  const digits = String(display || '').replace(/\D/g, '').slice(0, 10);
  return digits ? `+1${digits}` : '';
};

const normalizeWebsite = (raw) => {
  if (!raw) return '';
  let s = String(raw).trim();
  if (!s) return '';
  if (!/^https?:\/\//i.test(s)) s = `https://${s}`;
  try {
    const u = new URL(s);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
    return s.replace(/\/$/, '');
  } catch {
    return '';
  }
};

async function editHostMarketAction(formData) {
  await connectDB();

  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    return { ok: false, error: 'User ID is required' };
  }
  const { userId } = sessionUser;

  // Find existing market
  const existingMarket = await HostFMarket.findOne({ owner: userId });
  if (!existingMarket) {
    return { ok: false, error: 'No market found to edit.' };
  }

  // -------- Build update data ----------
  const profileUrl = formData.get('hostfm_profile_image') || '';
  const addrPhoneDisplay = formData.get('hostfm_address.hostfm_phone_display') || '';
  const addrPhone = toE164(addrPhoneDisplay);

  const site = normalizeWebsite(formData.get('hostfm_website'));
  const stallAvail = formData.get('stall_avail') === 'true';
  const weekly = formData.get('hostfm_weekly_sched.weekly_sched') === 'true';

  const updateData = {
    hostfm_name: formData.get('hostfm_name'),
    hostfm_description: formData.get('hostfm_description'),
    hostfm_type: formData.get('hostfm_type'),
    hostfm_profile_image: profileUrl,
    email: formData.get('email'),
    hostfm_active: formData.get('hostfm_active') === 'true',
    stall_avail: stallAvail,
    ...(stallAvail && {
      stall_pricing: formData.get('stall_pricing'),
      stall_size: formData.get('stall_size'),
      stall_included: formData.get('stall_included'),
    }),
    hostfm_address: {
      hostfm_phone: addrPhone || undefined,
      add_line1: formData.get('hostfm_address.add_line1'),
      add_line2: formData.get('hostfm_address.add_line2'),
      city: formData.get('hostfm_address.city'),
      state_code: formData.get('hostfm_address.state_code'),
      zipcode: formData.get('hostfm_address.zipcode'),
      country: formData.get('hostfm_address.country') || 'USA',
    },
    ...(site && { hostfm_website: site }),
  };

  // Handle schedule (weekly vs random dates)
  if (weekly) {
    updateData.hostfm_weekly_sched = {
      weekly_sched: true,
    };
    DAYS.forEach((d) => {
      updateData.hostfm_weekly_sched[`${d}_hours`] = formData.get(`hostfm_weekly_sched.${d}_hours`) || '';
    });
    updateData.hostfm_dates = {
      hostfm_randomdates: false,
      dates: [],
    };
  } else {
    updateData.hostfm_weekly_sched = {
      weekly_sched: false,
    };
    const dates = [];
    for (let idx = 0; idx < MAX_DATES; idx++) {
      const dateVal = formData.get(`hostfm_dates.dates[${idx}].date`);
      if (dateVal) {
        dates.push({
          date: dateVal,
          time: formData.get(`hostfm_dates.dates[${idx}].time`) || '',
        });
      }
    }
    updateData.hostfm_dates = {
      hostfm_randomdates: true,
      dates,
    };
  }

  // --- Update with friendly error reporting ---
  try {
    await HostFMarket.findByIdAndUpdate(existingMarket._id, updateData, {
      new: true,
      runValidators: true,
    });

    revalidatePath('/', 'layout');
    return { ok: true, id: String(existingMarket._id) };
  } catch (err) {
    console.error('editHostMarketAction error:', err);

    if (err?.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || 'a unique field';
      return { ok: false, error: `Duplicate value for ${field}. Please change it and try again.` };
    }

    const msg = err?.message || 'Unknown error while updating your market.';
    return { ok: false, error: msg };
  }
}

export default editHostMarketAction;
