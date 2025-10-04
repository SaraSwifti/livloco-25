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
  // NextAuth v5 style: auth() exported from your central auth file (e.g., /auth.ts)
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
  // 10 digits -> assume US, prefix +1
  if (digits.length === 10) return `+1${digits}`;
  // 11 digits and starts with 1 -> +1##########
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  // Already looks like +E.164
  if (s.startsWith('+') && /^\+\d{10,15}$/.test(s)) return s;
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

  // Use session for ownership; fall back to email in form (dev only)
  let email = await getSessionEmail();
  if (!email) {
    const emailFromForm = form.get('email');
    if (emailFromForm) email = String(emailFromForm).toLowerCase();
  }
  if (!email) {
    throw new Error('Unauthorized: no session and no email provided.');
  }

  const owner = await User.findOne({ email }, { _id: 1 }).lean();
  if (!owner?._id) {
    throw new Error('User not found for the current email.');
  }
  data.owner = owner._id;
  data.email = email;

  // Coerce booleans for known flags
  const toBool = (x) => x === true || String(x).toLowerCase() === 'true';
  data.locobiz_active = toBool(data.locobiz_active);
  if (data.locobiz_address && typeof data.locobiz_address.post_permission !== 'undefined') {
    data.locobiz_address.post_permission = toBool(data.locobiz_address.post_permission);
  }

  // Normalize website (optional safeguard)
  if (data.website && typeof data.website === 'string') {
    data.website = data.website.replace(/\/$/, '');
  }

  // Normalize phone fields to E.164 (schema-friendly)
  if (data.phone) {
    const norm = toE164US(data.phone);
    if (!norm) {
      throw new Error('Invalid phone format. Please enter a valid US number like (616) 555-1212.');
    }
    data.phone = norm;
  }
  if (data.locobiz_address?.biz_phone) {
    const normBiz = toE164US(data.locobiz_address.biz_phone);
    data.locobiz_address.biz_phone = normBiz || undefined;
  }

  const doc = new LocoBiz(data);
  await doc.save();

  return { ok: true, id: String(doc._id) };
}
