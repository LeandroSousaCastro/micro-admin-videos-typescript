import { DeleteCategoryUseCase } from "../../delete-category.use-case";
import NotFoundError from "../../../../../@seedwork/domain/errors/not-found.error";
import { CategorySequelize } from "#category/infra/db/sequelize/category-sequelize";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";

const { CategorySequelizeRepository, CategoryModel } = CategorySequelize;

describe("DeleteCategoryUseCase Unit Tests", () => {
  let useCase: DeleteCategoryUseCase.UseCase;
  let repository: CategorySequelize.CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new DeleteCategoryUseCase.UseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    await expect(() => useCase.execute({ id: "fake id" })).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID fake id`)
    );
  });

  it("should delete a category", async () => {
    const model = await CategoryModel.factory().create();
    await useCase.execute({
      id: model.id,
    });
    const noHasModel = await CategoryModel.findByPk(model.id);
    expect(noHasModel).toBeNull();
  });
});
