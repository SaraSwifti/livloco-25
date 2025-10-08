// server/db/ensureIndexesFixed.js
import LocoBiz from '@/models/LocoBiz';

export async function ensureIndexesFixed() {
  // We assume connectDB() has already run.
  const results = { dropped: [], existing: [] };

  const indexes = await LocoBiz.collection.indexes();
  // keep a list for logging
  results.existing = indexes.map(ix => ix.name);

  // Drop the stale unique index on phone if present
  if (indexes.find(ix => ix.name === 'phone_1')) {
    await LocoBiz.collection.dropIndex('phone_1');
    results.dropped.push('phone_1');
    console.log('Dropped stale unique index phone_1');
  }

  return results;
}
