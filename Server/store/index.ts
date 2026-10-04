import { MemoryStore } from './memory';
import { MongoStore } from './mongo';
import type { Store } from './review';

/** Mongo when a URI is set; in memory otherwise, for local development. */
const createStore = (): Store =>
  process.env.MONGODB_ATLAS_URI
    ? new MongoStore(process.env.MONGODB_ATLAS_URI)
    : new MemoryStore();

export { createStore };
export type { Review, Store, Summary } from './review';
