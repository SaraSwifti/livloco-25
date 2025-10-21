import mongoose from 'mongoose'
//taking this out as it was a one-time fix
// import { ensureIndexesFixed } from '@/config/ensureIndexesFixed';

let connected = false
let connecting = false

const connectDB = async () => {
  // Check if MONGODB_URI is available
  if (!process.env.MONGODB_URI) {
    console.log('MONGODB_URI is not defined, skipping database connection')
    return
  }

  //only fields specified are saved to the database with strictQuery
  mongoose.set('strictQuery', true)

  // Disable mongoose buffering to prevent timeout issues
  mongoose.set('bufferCommands', false)

  //if the database is already connected, don't connect again
  if (connected) {
    return
  }

  //if already connecting, wait for it to complete
  if (connecting) {
    console.log('Database connection already in progress, waiting...')
    // Wait for connection to complete
    while (connecting && !connected) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
    return
  }

  connecting = true
  //connect to MongoDB
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      connectTimeoutMS: 30000, // 30 seconds
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 5, // Maintain a minimum of 5 socket connections
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
    })
    connected = true
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.log('MongoDB connection error:', error)
    connected = false
    throw error // Re-throw to handle in calling code
  } finally {
    connecting = false
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
