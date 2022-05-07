import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import {
  CreateCategoryUseCase,
  ListCategoriesUseCase,
} from '@fc/micro-videos/category/application';
import { CategoryInMemoryRepository } from '@fc/micro-videos/category/infra';
import CategoryRepository from '@fc/micro-videos/dist/category/domain/repository/category.repository';

const providers = {
  provide: 'CategoryInMemoryRepository',
  useClass: CategoryInMemoryRepository,
};

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    providers,
    {
      provide: CreateCategoryUseCase.UseCase,
      useFactory: (CategoryRepo: CategoryRepository.Repository) => {
        return new CreateCategoryUseCase.UseCase(CategoryRepo);
      },
      inject: [providers.provide],
    },
    {
      provide: ListCategoriesUseCase.UseCase,
      useFactory: (CategoryRepo: CategoryRepository.Repository) => {
        return new ListCategoriesUseCase.UseCase(CategoryRepo);
      },
      inject: [providers.provide],
    },
  ],
})
export class CategoriesModule {}
