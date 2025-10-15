// app/api/migrate-saved-fields/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import mongoose from 'mongoose';

export async function GET() {
  try {
    // Get session to ensure only logged-in users can run this
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    console.log('Starting migration...');

    // Update all users to add the saved_businesses and saved_markets fields
    const result = await usersCollection.updateMany(
      {
        $or: [
          { saved_businesses: { $exists: false } },
          { saved_markets: { $exists: false } }
        ]
      },
      {
        $set: {
          saved_businesses: [],
          saved_markets: []
        }
      }
    );

    console.log(`Migration complete!`);
    console.log(`Matched ${result.matchedCount} users`);
    console.log(`Modified ${result.modifiedCount} users`);

    // Verify the migration for the current user
    const currentUser = await usersCollection.findOne({ email: session.user.email });

    return NextResponse.json({
      success: true,
      message: 'Migration completed successfully',
      stats: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      },
      currentUser: {
        email: currentUser.email,
        hasSavedBusinesses: currentUser.hasOwnProperty('saved_businesses'),
        hasSavedMarkets: currentUser.hasOwnProperty('saved_markets'),
        savedBusinessesValue: currentUser.saved_businesses,
        savedMarketsValue: currentUser.saved_markets
      }
    });
  } catch (error) {
    console.error('Migration failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Migration failed',
        details: error.message
      },
      { status: 500 }
    );
  }
}
