// scripts/migrate-add-saved-fields.js
// This script adds the saved_businesses and saved_markets fields to all existing users

const mongoose = require('mongoose');

// Manually set your MongoDB URI here (temporarily)
// You can find this in your .env.local file
const MONGODB_URI = process.env.MONGODB_URI || 'YOUR_MONGODB_URI_HERE';

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

async function migrate() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

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

    // Verify the migration
    const sampleUser = await usersCollection.findOne({});
    console.log('\nSample user after migration:');
    console.log('- has saved_businesses:', sampleUser.hasOwnProperty('saved_businesses'));
    console.log('- has saved_markets:', sampleUser.hasOwnProperty('saved_markets'));
    console.log('- saved_businesses value:', sampleUser.saved_businesses);
    console.log('- saved_markets value:', sampleUser.saved_markets);

    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

migrate();
