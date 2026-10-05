import { summarise, type Review, type Store } from './review';

/** Lost on restart. Only for running the server locally without Mongo. */
class MemoryStore implements Store {
  #reviews: Review[] = [];

  async create(review: Review) {
    this.#reviews.unshift(review);
  }

  async get(userGUID: string, id: string) {
    return (
      this.#reviews.find(
        (review) => review.userGUID === userGUID && review.id === id
      ) ?? null
    );
  }

  async list(userGUID: string, limit: number) {
    return this.#reviews
      .filter((review) => review.userGUID === userGUID && !review.rejection)
      .slice(0, limit)
      .map(summarise);
  }

  async countSince(userGUID: string, since: Date) {
    return this.#reviews.filter(
      (review) => review.userGUID === userGUID && review.createdAt >= since
    ).length;
  }

  async healthy() {
    return true;
  }
}

export { MemoryStore };
