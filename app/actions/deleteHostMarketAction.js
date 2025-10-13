// app/actions/deleteHostMarketAction.js
'use server';

import connectDB from '@/config/database';
import HostFMarket from '@/models/HostFMarket';
import User from '@/models/User';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';

async function deleteHostMarketAction() {
  await connectDB();

  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    return { ok: false, error: 'User ID is required' };
  }
  const { userId } = sessionUser;

  try {
    // Find existing market
    const existingMarket = await HostFMarket.findOne({ owner: userId });
    if (!existingMarket) {
      return { ok: false, error: 'No market found to delete.' };
    }

    const marketId = existingMarket._id;

    // Remove this market from all users' voted_markets arrays
    await User.updateMany(
      { voted_markets: marketId },
      { $pull: { voted_markets: marketId } }
    );

    // Delete the market
    await HostFMarket.findByIdAndDelete(marketId);

    // Update user profile_choice to 'none' and remove hostfmarket reference
    await User.findByIdAndUpdate(userId, {
      profile_choice: 'none',
      $unset: { hostfmarket: 1 }
    });

    revalidatePath('/', 'layout');
    return { ok: true };
  } catch (err) {
    console.error('deleteHostMarketAction error:', err);
    const msg = err?.message || 'Unknown error while deleting your market.';
    return { ok: false, error: msg };
  }
}

export default deleteHostMarketAction;
