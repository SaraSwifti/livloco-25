// app/actions/deleteBusinessAction.js
'use server';

import connectDB from '@/config/database';
import LocoBiz from '@/models/LocoBiz';
import User from '@/models/User';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';

async function deleteBusinessAction() {
  await connectDB();

  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    return { ok: false, error: 'User ID is required' };
  }
  const { userId } = sessionUser;

  try {
    // Find existing business
    const existingBiz = await LocoBiz.findOne({ owner: userId });
    if (!existingBiz) {
      return { ok: false, error: 'No business found to delete.' };
    }

    // Delete the business
    await LocoBiz.findByIdAndDelete(existingBiz._id);

    // Update user profile_choice to 'none' and remove locobiz reference
    await User.findByIdAndUpdate(userId, {
      profile_choice: 'none',
      $unset: { locobiz: 1 }
    });

    revalidatePath('/', 'layout');
    return { ok: true };
  } catch (err) {
    console.error('deleteBusinessAction error:', err);
    const msg = err?.message || 'Unknown error while deleting your business.';
    return { ok: false, error: msg };
  }
}

export default deleteBusinessAction;
