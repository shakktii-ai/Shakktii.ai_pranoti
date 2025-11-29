// lib/db.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  // Fail fast on missing env var (important on Vercel)
  throw new Error('Please define the MONGODB_URI environment variable in Vercel/Env.');
}

// Use globalThis to persist across lambda warm calls
let cached = globalThis._mongooseCache;

if (!cached) {
  cached = globalThis._mongooseCache = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Mongoose v7 doesn't require useNewUrlParser / useUnifiedTopology options,
    // but providing server selection timeout helps fail fast.
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // fail fast if cannot find servers
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      return m;
    });
  }

  try {
    const mongooseInstance = await cached.promise;
    cached.conn = mongooseInstance;
    return cached.conn;
  } catch (err) {
    // Reset promise so subsequent calls can retry
    cached.promise = null;
    throw err;
  }
}

export default dbConnect;
