// livloco-25/app/actions/addBusinessAction.js
'use server';
import connectDB from '@/config/database';
import LocoBiz from '@/models/LocoBiz';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';
import uploadToCloudinary from '@/utils/uploadToCloudinary';

const days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

async function addBusinessAction(formData) {
  await connectDB();

  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    throw new Error('User ID is required');
  }
  const { userId } = sessionUser;

  // -------- Images (already fine) ----------
  const getImageUrlFromField = async (v) => {
    if (!v || typeof v !== 'string') return '';
    return v.startsWith('http') ? v : '';
  };
  const profileImageUrl = await getImageUrlFromField(formData.get('locobiz_profile_image'));
  const selling1ImageUrl = await getImageUrlFromField(formData.get('selling.selling1.image'));
  const selling2ImageUrl = await getImageUrlFromField(formData.get('selling.selling2.image'));
  const selling3ImageUrl = await getImageUrlFromField(formData.get('selling.selling3.image'));
  const need1ImageUrl    = await getImageUrlFromField(formData.get('needs.need1.image'));
  const need2ImageUrl    = await getImageUrlFromField(formData.get('needs.need2.image'));
  const need3ImageUrl    = await getImageUrlFromField(formData.get('needs.need3.image'));

  // -------- Account phones ----------
  let phoneRaw = formData.get('phone') || '';
  let phoneDigits = String(phoneRaw).replace(/\D/g, '');
  let phone = phoneDigits.length === 10 ? `+1${phoneDigits}` : phoneDigits;

  let bizPhoneRaw = formData.get('locobiz_address.biz_phone') || '';
  let bizPhoneDigits = String(bizPhoneRaw).replace(/\D/g, '');
  let biz_phone = bizPhoneDigits.length === 10 ? `+1${bizPhoneDigits}` : (bizPhoneDigits || undefined);

  // -------- Storefront address (checkbox → boolean) ----------
  const hasStorefront = formData.get('locobiz_address.post_permission') === 'true';
  let locobizAddress = null;
  if (hasStorefront) {
    const addrStateCode = (formData.get('locobiz_address.state_code') || '').toString().toUpperCase(); // FIX #2
    locobizAddress = {
      post_permission: true,                 // boolean, not string
      biz_phone,
      add_line1: formData.get('locobiz_address.add_line1') || '',
      add_line2: formData.get('locobiz_address.add_line2') || '',
      city:     formData.get('locobiz_address.city') || '',
      state_code: addrStateCode || undefined, // let pre-save hook fill state_name
      zipcode:  formData.get('locobiz_address.zipcode') || '',
      country:  formData.get('locobiz_address.country') || 'USA',
    };
  }

  // -------- Farmers market locations ----------
  const fm_location_post = formData.get('farmers_market_location.fm_location_post') === 'true'; // FIX #3
  const farmers_market_location = { fm_location_post };
  for (const d of days) {
    const stateCode = (formData.get(`farmers_market_location.${d}.state_code`) || '')
      .toString()
      .toUpperCase(); // form uses state_code
    farmers_market_location[d] = {
      farmers_market_name: formData.get(`farmers_market_location.${d}.farmers_market_name`) || '',
      city: formData.get(`farmers_market_location.${d}.city`) || '',
      state_code: stateCode || undefined, // model uses state_code/state_name
      zip: formData.get(`farmers_market_location.${d}.zip`) || '', // if you add a ZIP input later
    };
  }

  // -------- Website (keep undefined when empty to avoid unique collisions) ----------
  const website = (() => {
    const w = formData.get('website');
    if (typeof w !== 'string') return undefined;
    const trimmed = w.trim();
    return trimmed ? trimmed : undefined;
  })();

  // -------- Build document ----------
  const locobizData = {
    owner: userId, // FIX #1 — required by schema

    account_owner_name: formData.get('account_owner_name') || '',

    phone,
    mem_zip: formData.get('mem_zip'),
    locobiz_active: formData.get('locobiz_active') === 'true', // FIX #5 (optional)

    locobiz_name: formData.get('locobiz_name'),
    locobiz_description: formData.get('locobiz_description'),

    ...(locobizAddress && { locobiz_address: locobizAddress }),

    business_hours: {
      monday_hours: formData.get('business_hours.monday_hours'),
      tuesday_hours: formData.get('business_hours.tuesday_hours'),
      wednesday_hours: formData.get('business_hours.wednesday_hours'),
      thursday_hours: formData.get('business_hours.thursday_hours'),
      friday_hours: formData.get('business_hours.friday_hours'),
      saturday_hours: formData.get('business_hours.saturday_hours'),
      sunday_hours: formData.get('business_hours.sunday_hours'),
    },

    website,
    locobiz_profile_image: profileImageUrl,

    farmers_market_location, // FIX #3 applied everywhere

    selling: {
      selling1: { type: formData.get('selling.selling1.type'), description: formData.get('selling.selling1.description'), image: selling1ImageUrl, price: formData.get('selling.selling1.price') },
      selling2: { type: formData.get('selling.selling2.type'), description: formData.get('selling.selling2.description'), image: selling2ImageUrl, price: formData.get('selling.selling2.price') },
      selling3: { type: formData.get('selling.selling3.type'), description: formData.get('selling.selling3.description'), image: selling3ImageUrl, price: formData.get('selling.selling3.price') },
    },

    needs: {
      need1: { type: formData.get('needs.need1.type'), description: formData.get('needs.need1.description'), image: need1ImageUrl },
      need2: { type: formData.get('needs.need2.type'), description: formData.get('needs.need2.description'), image: need2ImageUrl },
      need3: { type: formData.get('needs.need3.type'), description: formData.get('needs.need3.description'), image: need3ImageUrl },
    },

    current_promotional: formData.get('current_promotional'),
  };

  // const newLocoBiz = new LocoBiz(locobizData);
  // await newLocoBiz.save();

  revalidatePath('/', 'layout');
  return { id: String(newLocoBiz._id) };

    // --- Save with friendly error reporting ---
  // try {
  //   const newLocoBiz = await LocoBiz.create(locobizData);

  //   revalidatePath('/', 'layout');
  //   return { ok: true, id: String(newLocoBiz._id) };
  // } catch (err) {
  //   // Helpful logging on the server
  //   console.error('addBusinessAction error:', err);

  //   // Friendly duplicate-key message
  //   if (err?.code === 11000) {
  //     const field = Object.keys(err.keyPattern || {})[0] || 'a unique field';
  //     return { ok: false, error: `Duplicate value for ${field}. Please change it and try again.` };
  //   }

  //   // Fall back to the error message if present
  //   const msg = err?.message || 'Unknown error while saving your business.';
  //   return { ok: false, error: msg };
  // }



}

export default addBusinessAction;
