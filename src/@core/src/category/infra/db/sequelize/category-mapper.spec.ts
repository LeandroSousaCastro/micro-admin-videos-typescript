import { Sequelize } from "sequelize-typescript";
import { CategoryModelMapper } from "./category-mapper";
import { CategoryModel } from "./category-model";
import { CategorySequelizeRepository } from "./category-repository";
import { LoadEntityError } from "#seedwork/domain";

describe("CategoryModelMapper Unit Test", () => {
  let sequelize: Sequelize;
  let repository: CategorySequelizeRepository;

  beforeAll(
    () =>
      (sequelize = new Sequelize({
        dialect: "sqlite",
        host: ":memory:",
        logging: false,
        models: [CategoryModel],
      }))
  );

  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel);
    await sequelize.sync({ force: true });
  });

  afterAll(async () => await sequelize.close());

  it("should throws errors when category is invalid", () => {
    const model = CategoryModel.build({
      id: "9366b7dc-2d71-4799-b91c-c64adb205104",
    });
    try {
      CategoryModelMapper.toEntity(model);
      fail("The category is valid but it needs throws a LoadEntityError");
    } catch (error) {
      expect(error).toBeInstanceOf(LoadEntityError);
      expect(error.error).toMatchObject({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ]
      });
    }
  });
});
