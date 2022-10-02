import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from '../../categories.controller';
import { CategoriesModule } from '../../categories.module';
import { DatabaseModule } from '../../../database/database.module';
import { ConfigModule } from '../../../config/config.module';
import {
  CreateCategoryUseCase,
  UpdateCategoryUseCase,
  ListCategoriesUseCase,
  GetCategoryUseCase,
  DeleteCategoryUseCase,
} from '@fc/micro-videos/category/application';
import { CategoryRepository } from '@fc/micro-videos/category/domain';
import { CATEGORY_PROVIDERS } from '../../category.providers';
import { CategorySequelize } from '@fc/micro-videos/category/infra';
import { NotFoundError } from '@fc/micro-videos/@seedwork/domain';

describe('CategoriesController Integration Tests', () => {
  let controller: CategoriesController;
  let repository: CategoryRepository.Repository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
    }).compile();

    controller = module.get(CategoriesController);
    repository = module.get(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
  });

  it('should controller be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['createUseCase']).toBeInstanceOf(
      CreateCategoryUseCase.UseCase,
    );
    expect(controller['updateUseCase']).toBeInstanceOf(
      UpdateCategoryUseCase.UseCase,
    );
    expect(controller['listUseCase']).toBeInstanceOf(
      ListCategoriesUseCase.UseCase,
    );
    expect(controller['getUseCase']).toBeInstanceOf(GetCategoryUseCase.UseCase);
    expect(controller['deleteUseCase']).toBeInstanceOf(
      DeleteCategoryUseCase.UseCase,
    );
  });

  describe('should create a category', () => {
    const arrange = [
      {
        request: {
          name: 'Test',
        },
        expectPresenter: {
          name: 'Test',
          description: null,
          is_active: true,
        },
      },
      {
        request: {
          name: 'Test',
          description: 'Test description',
        },
        expectPresenter: {
          name: 'Test',
          description: 'Test description',
          is_active: true,
        },
      },
      {
        request: {
          name: 'Test',
          description: 'Test description',
          is_active: false,
        },
        expectPresenter: {
          name: 'Test',
          description: 'Test description',
          is_active: false,
        },
      },
      {
        request: {
          name: 'Test',
          is_active: false,
        },
        expectPresenter: {
          name: 'Test',
          description: null,
          is_active: false,
        },
      },
    ];

    test.each(arrange)(
      'with request $request',
      async ({ request, expectPresenter }) => {
        const presenter = await controller.create(request);
        const entity = await repository.findById(presenter.id);
        expect(entity).toMatchObject({
          id: presenter.id,
          name: expectPresenter.name,
          description: expectPresenter.description,
          is_active: expectPresenter.is_active,
          created_at: presenter.created_at,
        });

        expect(presenter.id).toBe(entity.id);
        expect(presenter.name).toBe(expectPresenter.name);
        expect(presenter.description).toBe(expectPresenter.description);
        expect(presenter.is_active).toBe(expectPresenter.is_active);
        expect(presenter.created_at).toStrictEqual(entity.created_at);
      },
    );
  });

  describe('should update a category', () => {
    let category: CategorySequelize.CategoryModel;

    beforeEach(async () => {
      category = await CategorySequelize.CategoryModel.factory().create();
    });

    const arrange = [
      {
        categoryProps: {
          name: 'Test name',
        },
        request: {
          name: 'Test',
        },
        expectPresenter: {
          name: 'Test',
          description: null,
          is_active: true,
        },
      },
      {
        categoryProps: {
          name: 'Test name',
        },
        request: {
          name: 'Test',
          description: 'Test description',
        },
        expectPresenter: {
          name: 'Test',
          description: 'Test description',
          is_active: true,
        },
      },
      {
        categoryProps: {
          name: 'Test name',
        },
        request: {
          name: 'Test',
          description: 'Test description',
          is_active: false,
        },
        expectPresenter: {
          name: 'Test',
          description: 'Test description',
          is_active: false,
        },
      },
      {
        categoryProps: {
          name: 'Test name',
        },
        request: {
          name: 'Test',
          is_active: false,
        },
        expectPresenter: {
          name: 'Test',
          description: null,
          is_active: false,
        },
      },
      {
        categoryProps: {
          name: 'Test name',
          is_active: false,
        },
        request: {
          name: 'Test',
          is_active: true,
        },
        expectPresenter: {
          name: 'Test',
          description: null,
          is_active: true,
        },
      },
    ];

    test.each(arrange)(
      'with request $request',
      async ({ categoryProps, request, expectPresenter }) => {
        await category.update(categoryProps);
        const presenter = await controller.update(category.id, request);
        const entity = await repository.findById(presenter.id);
        expect(entity).toMatchObject({
          id: presenter.id,
          name: expectPresenter.name,
          description: expectPresenter.description,
          is_active: expectPresenter.is_active,
          created_at: presenter.created_at,
        });

        expect(presenter.id).toBe(entity.id);
        expect(presenter.name).toBe(expectPresenter.name);
        expect(presenter.description).toBe(expectPresenter.description);
        expect(presenter.is_active).toBe(expectPresenter.is_active);
        expect(presenter.created_at).toStrictEqual(entity.created_at);
      },
    );
  });

  it('should delete a category', async () => {
    const category = await CategorySequelize.CategoryModel.factory().create();
    const response = await controller.remove(category.id);
    expect(response).not.toBeDefined();
    await expect(repository.findById(category.id)).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID ${category.id}`),
    );
  });

  it('should get a category', async () => {
    const category = await CategorySequelize.CategoryModel.factory().create();
    const presenter = await controller.findOne(category.id);
    expect(presenter.id).toBe(category.id);
    expect(presenter.name).toBe(category.name);
    expect(presenter.description).toBe(category.description);
    expect(presenter.is_active).toBe(category.is_active);
    expect(presenter.created_at).toStrictEqual(category.created_at);
  });
});
