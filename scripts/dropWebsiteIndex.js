// scripts/dropWebsiteIndex.js
// Run this once to drop the old unique index on the website field

import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://saraswifti:biteme123@livlocodev.txyjw.mongodb.net/livlocoop?retryWrites=true&w=majority&appName=LivlocoDev';

async function dropWebsiteIndex() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('locobizs');

    // List current indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes);

    // Drop the website_1 index if it exists
    try {
      await collection.dropIndex('website_1');
      console.log('✅ Successfully dropped website_1 index');
    } catch (err) {
      if (err.code === 27) {
        console.log('ℹ️  Index website_1 does not exist (already dropped)');
      } else {
        throw err;
      }
    }

    // Verify indexes after drop
    const indexesAfter = await collection.indexes();
    console.log('Indexes after drop:', indexesAfter);

    await mongoose.connection.close();
    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

dropWebsiteIndex();
