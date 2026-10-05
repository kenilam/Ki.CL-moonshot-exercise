import { MongoClient, type Collection } from 'mongodb';

import { summarise, type Review, type Store } from './review';

type Document = Omit<Review, 'id'> & { _id: string };

const PING_TIMEOUT_MS = 2000;

/**
 * The same database as Ki.CL-back - `test` locally, `production` in
 * production - in a collection named for this module, so it sits beside the
 * API's collections without touching them.
 */
class MongoStore implements Store {
  #client: MongoClient | null = null;
  #connecting: Promise<Collection<Document>> | null = null;
  readonly #uri: string;

  constructor(uri: string) {
    this.#uri = uri;
  }

  /**
   * Connects on first use. A failed connection isn't kept, so the next request
   * tries again instead of failing for as long as the instance lives.
   */
  get #reviews() {
    this.#connecting ??= this.#connect().catch((error: unknown) => {
      this.#connecting = null;

      throw error;
    });

    return this.#connecting;
  }

  async #connect() {
    const client = await new MongoClient(this.#uri).connect();
    const reviews = client
      .db(process.env.MONGODB_DATABASE || 'test')
      .collection<Document>('moonshot-reviews');

    await reviews.createIndex({ userGUID: 1, createdAt: -1 });
    this.#client = client;

    return reviews;
  }

  /**
   * Whether the primary answers. A client that has lost the primary stays
   * connected and fails every query after 30 seconds of server selection.
   * Before the first connection there is nothing to check, and the next
   * request connects fresh.
   */
  async healthy() {
    if (!this.#client) {
      return true;
    }

    try {
      await this.#client
        .db('admin')
        .command(
          { ping: 1 },
          { readPreference: 'primary', timeoutMS: PING_TIMEOUT_MS }
        );

      return true;
    } catch (error) {
      console.error('MongoDB primary did not answer:', error);

      return false;
    }
  }

  async create({ id, ...review }: Review) {
    await (await this.#reviews).insertOne({ _id: id, ...review });
  }

  async get(userGUID: string, id: string) {
    const document = await (await this.#reviews).findOne({ _id: id, userGUID });

    return document ? toReview(document) : null;
  }

  async list(userGUID: string, limit: number) {
    const documents = await (
      await this.#reviews
    )
      .find({ userGUID, rejection: null })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return documents.map(toReview).map(summarise);
  }

  async countSince(userGUID: string, since: Date) {
    return (await this.#reviews).countDocuments({
      createdAt: { $gte: since },
      userGUID,
    });
  }
}

const toReview = ({ _id, ...review }: Document): Review => ({
  id: _id,
  ...review,
});

export { MongoStore };
