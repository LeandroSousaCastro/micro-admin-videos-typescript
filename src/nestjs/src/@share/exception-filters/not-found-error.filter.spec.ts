import { NotFoundError } from '@fc/micro-videos/@seedwork/domain';
import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundErrorFilter } from './not-found-error.filter';
import request from 'supertest';

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new NotFoundError('fake not found error message');
  }
}

describe('NotFoundErrorFilter Unit Test', () => {
  it('should be defined', () => {
    expect(new NotFoundErrorFilter()).toBeDefined();
  });

  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new NotFoundErrorFilter());
    await app.init();
  });

  it('should be defined', () => {
    expect(new NotFoundErrorFilter()).toBeDefined();
  });

  it('should catch a EntityValidaionError', () => {
    return request(app.getHttpServer())
      .get('/stub')
      .expect(404)
      .expect({
        statusCode: 404,
        error: 'Not Found',
        message: 'fake not found error message',
      });
  });
});
