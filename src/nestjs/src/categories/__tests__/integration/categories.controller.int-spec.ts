import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from '../../categories.controller';
import { CategoriesModule } from '../../categories.module';
import { DatabaseModule } from '../../../database/database.module';
import { ConfigModule } from '../../../config/config.module';
import { CreateCategoryUseCase } from '@fc/micro-videos/category/application';

describe('CategoriesController Integration Tests', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
    }).compile();

    controller = module.get(CategoriesController);
  });

  it('should controller be defined', () => {
    expect(controller).toBeDefined();
    console.log(controller);
    expect(controller['createUseCase']).toBeInstanceOf(
      CreateCategoryUseCase.UseCase,
    );
  });
});
