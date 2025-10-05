// app/actions/addBusinessAction.js
'use server';

import connectDB from '@/config/database';
import LocoBiz from '@/models/LocoBiz';
import User from '@/models/User';

/**
 * Try NextAuth v5 first (auth()), then v4 (getServerSession(authOptions)).
 * Returns a lower-cased email or null if no session.
 */
async function getSessionEmail() {
  // NextAuth v5 style
  try {
    const mod = await import('@/auth');
    if (mod?.auth) {
      const s = await mod.auth();
      if (s?.user?.email) return String(s.user.email).toLowerCase();
    }
  } catch {}

  // NextAuth v4 style
  try {
    const { getServerSession } = await import('next-auth');
    const { authOptions } = await import('@/server/auth/authOptions');
    const s = await getServerSession(authOptions);
    if (s?.user?.email) return String(s.user.email).toLowerCase();
  } catch {}

  return null;
}

function toE164US(input) {
  const s = String(input || '').trim();
  if (!s) return '';
  const digits = s.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 10) return `+1${digits}`;         // 10 digits -> US
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`; // 1##########
  if (s.startsWith('+') && /^\+\d{10,15}$/.test(s)) return s;            // already E.164
  return '';
}

export default async function addBusinessAction(form) {
  await connectDB();

  // Build a plain object from FormData that supports dot-paths & array indices
  const data = {};
  for (const [k, v] of form.entries()) {
    const set = (obj, path, value) => {
      const parts = String(path).replace(/\]/g, '').split(/\.|\[/g);
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

  // Resolve user/owner from session (or form email as dev fallback)
  let email = await getSessionEmail();
  if (!email) {
    const emailFromForm = form.get('email');
    if (emailFromForm) email = String(emailFromForm).toLowerCase();
  }
  if (!email) throw new Error('Unauthorized: no session and no email provided.');

  const userDoc = await User.findOne({ email }).lean();
  if (!userDoc?._id) throw new Error('User not found for the current email.');

  data.owner = userDoc._id;
  data.email = email; // pinned; not unique at LocoBiz level

  // Coerce booleans for known flags
  const toBool = (x) => x === true || String(x).toLowerCase() === 'true';
  data.locobiz_active = toBool(data.locobiz_active);
  if (data.locobiz_address && typeof data.locobiz_address.post_permission !== 'undefined') {
    data.locobiz_address.post_permission = toBool(data.locobiz_address.post_permission);
  }

  // Default account data from User if missing
  if (!data.account_owner_name || !String(data.account_owner_name).trim()) {
    data.account_owner_name = userDoc.full_name || '';
  }
  if (!data.phone || !String(data.phone).trim()) {
    data.phone = userDoc.phone || '';
  }

  // Normalize website (optional safeguard)
  if (data.website && typeof data.website === 'string') {
    data.website = data.website.replace(/\/$/, '');
  }

  // Normalize phone fields to E.164 (schema-friendly) if provided
  if (data.phone) {
    const norm = toE164US(data.phone);
    if (!norm) {
      // Not required; drop invalid rather than failing save
      data.phone = undefined;
    } else {
      data.phone = norm;
    }
  }
  if (data.locobiz_address?.biz_phone) {
    const normBiz = toE164US(data.locobiz_address.biz_phone);
    data.locobiz_address.biz_phone = normBiz || undefined;
  }

  const doc = new LocoBiz(data);
  await doc.save();

  return { ok: true, id: String(doc._id) };
}
