// scripts/removeDuplicates.js
// Remove duplicate LocoBiz and HostFMarket entries, keeping only the first one per user

import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://saraswifti:biteme123@livlocodev.txyjw.mongodb.net/livlocoop?retryWrites=true&w=majority&appName=LivlocoDev';

async function removeDuplicates() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;

    // Remove duplicate LocoBiz entries
    console.log('\n--- Checking LocoBiz duplicates ---');
    const locobizCollection = db.collection('locobizs');
    const locobizDuplicates = await locobizCollection.aggregate([
      { $group: { _id: '$owner', count: { $sum: 1 }, ids: { $push: '$_id' } } },
      { $match: { count: { $gt: 1 } } }
    ]).toArray();

    console.log(`Found ${locobizDuplicates.length} users with duplicate LocoBiz entries`);

    for (const dup of locobizDuplicates) {
      const [keepId, ...deleteIds] = dup.ids;
      console.log(`Owner ${dup._id}: Keeping ${keepId}, deleting ${deleteIds.length} duplicates`);
      await locobizCollection.deleteMany({ _id: { $in: deleteIds } });
    }

    // Remove duplicate HostFMarket entries
    console.log('\n--- Checking HostFMarket duplicates ---');
    const hostfmarketCollection = db.collection('hostfmarkets');
    const hostfmarketDuplicates = await hostfmarketCollection.aggregate([
      { $group: { _id: '$owner', count: { $sum: 1 }, ids: { $push: '$_id' } } },
      { $match: { count: { $gt: 1 } } }
    ]).toArray();

    console.log(`Found ${hostfmarketDuplicates.length} users with duplicate HostFMarket entries`);

    for (const dup of hostfmarketDuplicates) {
      const [keepId, ...deleteIds] = dup.ids;
      console.log(`Owner ${dup._id}: Keeping ${keepId}, deleting ${deleteIds.length} duplicates`);
      await hostfmarketCollection.deleteMany({ _id: { $in: deleteIds } });
    }

    console.log('\n✅ Cleanup complete!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

removeDuplicates();
