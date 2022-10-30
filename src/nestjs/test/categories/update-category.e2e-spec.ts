import { Category, CategoryRepository } from '@fc/micro-videos/category/domain';
import { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { CategoriesController } from '../../src/categories/categories.controller';
import { CATEGORY_PROVIDERS } from '../../src/categories/category.providers';
import { UpdateCategoryFixture } from '../../src/categories/__tests__/fixtures';
import { applyGlobalConfig } from '../../src/global-config';

function startApp({
  beforeInit,
}: { beforeInit?: (app: INestApplication) => void } = {}) {
  let _app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    _app = moduleFixture.createNestApplication();
    applyGlobalConfig(_app);
    beforeInit && beforeInit(_app);
    await _app.init();
  });

  return {
    get app() {
      return _app;
    },
  };
}

describe('CategoriesController (e2e)', () => {
  const uuid = '9366b7dc-2d71-4799-b91c-c64adb205104';

  describe('PUT /categories/:id', () => {
    const app = startApp();

    describe('should a response error when id is invalid ao not found', () => {
      const nestApp = startApp();
      const categoryFaker = Category.fake().aCategory();
      const arrange = [
        {
          id: uuid,
          send_data: { name: categoryFaker.name },
          expected: {
            message: `Entity Not Found using ID ${uuid}`,
            statusCode: 404,
            error: 'Not Found',
          },
        },
        {
          id: 'fake-id',
          send_data: { name: categoryFaker.name },
          expected: {
            message: 'Validation failed (uuid  is expected)',
            statusCode: 422,
            error: 'Unprocessable Entity',
          },
        },
      ];
      test.each(arrange)(
        'when id is %id',
        async ({ id, send_data, expected }) => {
          return request(nestApp.app.getHttpServer())
            .put(`/categories/${id}`)
            .send(send_data)
            .expect(expected.statusCode)
            .expect(expected);
        },
      );
    });

    describe('should a response errro with 422 when request body is invalid', () => {
      const insvalidRequest = UpdateCategoryFixture.arrangeInvalidRequest();
      const arrange = Object.keys(insvalidRequest).map((key) => ({
        label: key,
        value: insvalidRequest[key],
      }));
      test.each(arrange)('when body is $label', ({ value }) => {
        return request(app.app.getHttpServer())
          .put(`/categories/${uuid}`)
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should a response errro with 422 when throw EntityValidationError', () => {
      const app = startApp({
        beforeInit: (app) => {
          app['config'].globalPipes = [];
        },
      });
      const validationError =
        UpdateCategoryFixture.arrangeForEntityValidationError();
      const arrange = Object.keys(validationError).map((key) => ({
        label: key,
        value: validationError[key],
      }));
      let categoryRepository: CategoryRepository.Repository;
      beforeEach(() => {
        categoryRepository = app.app.get<CategoryRepository.Repository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
      });
      test.each(arrange)('when body is $label', ({ value }) => {
        const category = Category.fake().aCategory().build();
        categoryRepository.insert(category);
        return request(app.app.getHttpServer())
          .put(`/categories/${category.id}`)
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should update a new category', () => {
      const app = startApp();
      const arrange = UpdateCategoryFixture.arrangeForSave();
      let categoryRepository: CategoryRepository.Repository;
      beforeEach(async () => {
        categoryRepository = app.app.get<CategoryRepository.Repository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
        const sequelize = app.app.get(getConnectionToken());
        await sequelize.sync({ force: true });
      });
      test.each(arrange)(
        'when body is $send_data',
        async ({ send_data, expected }) => {
          const categoryCreated = Category.fake().aCategory().build();
          categoryRepository.insert(categoryCreated);
          const res = await request(app.app.getHttpServer())
            .put(`/categories/${categoryCreated.id}`)
            .send(send_data)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8');
          const keysInResponse = UpdateCategoryFixture.keysInResponse();
          expect(Object.keys(res.body)).toStrictEqual(['data']);
          expect(Object.keys(res.body.data)).toStrictEqual(keysInResponse);
          const data = res.body.data;
          const categoryUpdate = await categoryRepository.findById(data.id);
          const presenter = CategoriesController.categoryToResponse(
            categoryUpdate.toJSON(),
          );
          const serialized = instanceToPlain(presenter);
          expect(data).toStrictEqual(serialized);
          expect(data).toStrictEqual({
            id: serialized.id,
            created_at: serialized.created_at,
            ...send_data,
            ...expected,
          });
        },
      );
    });
  });
});
