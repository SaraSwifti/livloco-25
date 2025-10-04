// app/actions/addHostMarketAction.js
'use server';

import connectDB from '@/config/database';
import HostFMarket from '@/models/HostFMarket';

export default async function addHostMarketAction(form) {
  await connectDB();

  const data = {};
  for (const [k, v] of form.entries()) {
    const set = (obj, path, value) => {
      const parts = String(path).replace(/\]/g,'').split(/\.|\[/g);
      let cur = obj;
      parts.forEach((p, i) => {
        const isLast = i === parts.length - 1;
        const nextIsIndex = /^\d+$/.test(parts[i + 1] || '');
        if (isLast) cur[p] = value;
        else {
          if (!(p in cur)) cur[p] = nextIsIndex ? [] : {};
          cur = cur[p];
        }
      });
    };
    set(data, k, v);
  }

  // Basic address validation
  const ZIP_REGEX = /^\d{5}(-\d{4})?$/;
  const addr = data.hostfm_address || {};
  if (!addr.add_line1?.trim() || !addr.city?.trim() || !addr.state_code || !addr.zipcode || !ZIP_REGEX.test(String(addr.zipcode))) {
    throw new Error('Address is required and must include: line1, city, state, and a valid ZIP.');
  }

  // Coerce booleans
  const toBool = (x) => x === true || String(x).toLowerCase() === 'true';
  data.hostfm_active = toBool(data.hostfm_active);
  data.stall_avail = toBool(data.stall_avail);
  if (data.hostfm_weekly_sched) {
    data.hostfm_weekly_sched.weekly_sched = toBool(data.hostfm_weekly_sched.weekly_sched);
  }
  if (data.hostfm_dates) {
    data.hostfm_dates.hostfm_randomdates = toBool(data.hostfm_dates.hostfm_randomdates);
    if (Array.isArray(data.hostfm_dates.dates)) {
      data.hostfm_dates.dates = data.hostfm_dates.dates.filter((d) => d && d.date).map((d) => ({ date: d.date, time: d.time || '' }));
    }
  }

  // Remove display-only field
  if (data.hostfm_address?.hostfm_phone_display) delete data.hostfm_address.hostfm_phone_display;

  const doc = new HostFMarket(data);
  await doc.save();

  return { ok: true, id: String(doc._id) };
}
