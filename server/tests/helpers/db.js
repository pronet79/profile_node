import mongoose from 'mongoose';

/*
  Attempts to start an in-memory MongoDB. Two strategies:
   1. If MONGO_TEST_URI is set, connect to that (CI / local mongod).
   2. Otherwise spin up mongodb-memory-server (downloads a binary on first run).
  If neither works (e.g. offline sandbox with no binary), returns { available:false }
  so integration suites can skip instead of failing the whole run.
*/
let mongod = null;

export async function startTestDb() {
  const uri = process.env.MONGO_TEST_URI;
  try {
    if (uri) {
      await mongoose.connect(uri);
      return { available: true, kind: 'external' };
    }
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    return { available: true, kind: 'memory' };
  } catch (err) {
    return { available: false, reason: err.message };
  }
}

export async function stopTestDb() {
  try {
    await mongoose.connection.dropDatabase();
  } catch { /* ignore */ }
  await mongoose.disconnect().catch(() => {});
  if (mongod) await mongod.stop().catch(() => {});
}

export async function clearCollections() {
  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map((c) => c.deleteMany({})));
}
