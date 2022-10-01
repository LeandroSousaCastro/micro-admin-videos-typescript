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
        expectOutput: {
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
        expectOutput: {
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
        expectOutput: {
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
        expectOutput: {
          name: 'Test',
          description: null,
          is_active: false,
        },
      },
    ];

    test.each(arrange)(
      'with request $request',
      async ({ request, expectOutput }) => {
        const output = await controller.create(request);
        const entity = await repository.findById(output.id);
        expect(entity).toMatchObject({
          id: output.id,
          name: expectOutput.name,
          description: expectOutput.description,
          is_active: expectOutput.is_active,
          created_at: output.created_at,
        });

        expect(output.id).toBe(entity.id);
        expect(output.name).toBe(expectOutput.name);
        expect(output.description).toBe(expectOutput.description);
        expect(output.is_active).toBe(expectOutput.is_active);
        expect(output.created_at).toStrictEqual(entity.created_at);
      },
    );
  });
});
