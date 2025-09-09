// app/api/me/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import User from '@/models/User';
import { getSessionUser } from '@/utils/getSessionUser';

export async function GET() {
  const sess = await getSessionUser();
  if (!sess?.userEmail) return NextResponse.json({ user: null });

  await connectDB();
  const user = await User.findOne({ email: sess.userEmail })
    .select('full_name phone email_memmessage_notification profile_choice locobiz hostfmarket')
    .lean();

  return NextResponse.json({ user });
}
