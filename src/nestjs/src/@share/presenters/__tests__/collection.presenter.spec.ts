import { instanceToPlain } from 'class-transformer';
import { CollectionPresenter } from '../collection.presenter';
import { PaginationPresenter } from '../pagination.presenter';

class StubCollectionPresenter extends CollectionPresenter {
  data = [1, 2, 3];
}

describe('CollectionPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const presenter = new StubCollectionPresenter({
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      });

      expect(presenter['meta']).toBeInstanceOf(PaginationPresenter);
      expect(presenter['meta'].current_page).toBe(1);
      expect(presenter['meta'].per_page).toBe(2);
      expect(presenter['meta'].last_page).toBe(3);
      expect(presenter['meta'].total).toBe(4);
      expect(presenter._meta).toEqual(presenter['meta']);
    });
  });

  it('should presenter data', () => {
    let presenter = new StubCollectionPresenter({
      current_page: 1,
      per_page: 2,
      last_page: 3,
      total: 4,
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      data: [1, 2, 3],
      meta: {
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      },
    });

    presenter = new StubCollectionPresenter({
      current_page: '1' as any,
      per_page: '2' as any,
      last_page: '3' as any,
      total: '4' as any,
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      data: [1, 2, 3],
      meta: {
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      },
    });
  });
});
