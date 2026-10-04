import { MongoClient, type Collection } from 'mongodb';

import { summarise, type Review, type Store } from './review';

type Document = Omit<Review, 'id'> & { _id: string };

/**
 * The same database as Ki.CL-back - `test` locally, `production` in
 * production - in a collection named for this module, so it sits beside the
 * API's collections without touching them.
 */
class MongoStore implements Store {
  #reviews: Promise<Collection<Document>>;

  constructor(uri: string) {
    this.#reviews = new MongoClient(uri).connect().then(async (client) => {
      const reviews = client
        .db(process.env.MONGODB_DATABASE || 'test')
        .collection<Document>('moonshot-reviews');

      await reviews.createIndex({ userGUID: 1, createdAt: -1 });

      return reviews;
    });
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
