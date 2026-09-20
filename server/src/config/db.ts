import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI?.trim();
  const allowMemoryFallback = process.env.ALLOW_MEMORY_DB_FALLBACK === 'true' || process.env.NODE_ENV !== 'production';

  if (uri) {
    console.log(`Connecting to MongoDB at: ${uri.replace(/\/\/.*@/, '//***:***@')}`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('MongoDB successfully connected.');
    return;
  }

  if (!allowMemoryFallback) {
    throw new Error('MONGODB_URI is required in production. Set it to a persistent MongoDB/Atlas connection string.');
  }

  console.warn('MONGODB_URI is not configured. Starting embedded MongoDB demo storage. Data is not persistent across server restarts.');
  mongoMemoryServer = await MongoMemoryServer.create();
  const memoryUri = mongoMemoryServer.getUri();
  await mongoose.connect(memoryUri);
  console.log('Embedded MongoDB started for demo mode.');
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  if (mongoMemoryServer) await mongoMemoryServer.stop();
}
