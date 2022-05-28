import { NotFoundError, UniqueEntityId } from "#seedwork/domain";
import { CategoryRepository, Category } from "#category/domain";
import { CategoryModel } from "./category-model";
import { CategoryModelMapper } from "./category-mapper";

export class CategorySequelizeRepository
  implements CategoryRepository.Repository
{
  sortableFields: string[] = ["name", "created_at"];

  constructor(private categoryModel: typeof CategoryModel) {}

  async insert(entity: Category): Promise<void> {
    await CategoryModel.create(entity.toJSON());
  }

  async findById(id: string | UniqueEntityId): Promise<Category> {
    const _id = `${id}`;
    const model = await this._get(_id);
    return CategoryModelMapper.toEntity(model);
  }

  //@ts-expect-error
  async findAll(): Promise<Category[]> {}
  async update(entity: Category): Promise<void> {}
  async delete(id: string | UniqueEntityId): Promise<void> {}

  private async _get(id: string) {
    return this.categoryModel.findByPk(id, {
      rejectOnEmpty: new NotFoundError(`Entity Not Found using ID ${id}`),
    });
  }
  
  async search(
    props: CategoryRepository.SearchParams
    //@ts-expect-error
  ): Promise<CategoryRepository.SearchResult> {}
}
