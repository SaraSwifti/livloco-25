import mongoose from 'mongoose'
//taking this out as it was a one-time fix
// import { ensureIndexesFixed } from '@/config/ensureIndexesFixed';

let connected = false

const connectDB = async () => {
  // Check if MONGODB_URI is available
  if (!process.env.MONGODB_URI) {
    console.log('MONGODB_URI is not defined, skipping database connection')
    return
  }

  //only fields specified are saved to the database with strictQuery
  mongoose.set('strictQuery', true)

  //if the database is already connected, don't connect again
  if (connected) {
    console.log('MongoDB is connected')
    return
  }
  //connect to MongoDB
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    connected = true
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.log('MongoDB connection error:', error)
  }

  // Run the fixer exactly once per process
  // if (!globalThis.__indexesFixedOnce) {
  //     globalThis.__indexesFixedOnce = (async () => {
  //         try {
  //             // IMPORTANT: models must be compiled *after* connect; you're good since imports happen on demand
  //             const res = await ensureIndexesFixed();
  //             if (res.dropped.length) {
  //                 console.log('Index cleanup:', res);
  //             }
  //         } catch (e) {
  //             // ignore "index not found"; log others
  //             if (!/index not found/i.test(String(e?.message))) {
  //                 console.error('Index cleanup failed:', e);
  //             }
  //         }
  //     })();
  // }
}

export default connectDB
