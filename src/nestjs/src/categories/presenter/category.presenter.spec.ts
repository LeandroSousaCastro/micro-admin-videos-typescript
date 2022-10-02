import { CategoryPresenter } from './category.presenter';
import { instanceToPlain } from 'class-transformer';

describe('Category Presenter Unit Tests', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const created_at = new Date();
      const presenter = new CategoryPresenter({
        id: 'uuid-id',
        name: 'Test',
        description: 'Some description',
        is_active: true,
        created_at,
      });

      expect(presenter.id).toBe('uuid-id');
      expect(presenter.name).toBe('Test');
      expect(presenter.description).toBe('Some description');
      expect(presenter.name).toBe('Test');
      expect(presenter.created_at).toBe(created_at);
    });
  });

  it('should presenter data', () => {
    const created_at = new Date();
    const presenter = new CategoryPresenter({
      id: 'uuid-id',
      name: 'Test',
      description: 'Some description',
      is_active: true,
      created_at,
    });

    const data = instanceToPlain(presenter);
    expect(data).toStrictEqual({
      id: 'uuid-id',
      name: 'Test',
      description: 'Some description',
      is_active: true,
      created_at: created_at.toISOString(),
    });
  });
});
