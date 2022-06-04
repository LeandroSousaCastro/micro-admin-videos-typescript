import { CategoryModelMapper } from "./category-mapper";
import { CategoryModel } from "./category-model";
import { LoadEntityError, UniqueEntityId } from "#seedwork/domain";
import { Category } from "#category/domain";
import { setupSequelize } from "../../../../@seedwork/infra/testing/helpers/db";

describe("CategoryModelMapper Unit Test", () => {
  setupSequelize({ models: [CategoryModel] });

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
        ],
      });
    }
  });

  it("should throw a generic error", () => {
    const error = new Error("Generic error");
    const spyValidate = jest
      .spyOn(Category, "validate")
      .mockImplementation(() => {
        throw error;
      });
    const model = CategoryModel.build({
      id: "9366b7dc-2d71-4799-b91c-c64adb205104",
    });
    expect(() => CategoryModelMapper.toEntity(model)).toThrow(error);
    expect(spyValidate).toHaveBeenCalled();
    spyValidate.mockRestore();
  });

  it("should convert a category model to a category entity", () => {
    const created_at = new Date();
    const model = CategoryModel.build({
      id: "9366b7dc-2d71-4799-b91c-c64adb205104",
      name: "Category 1",
      description: "Category 1 description",
      is_active: true,
      created_at,
    });
    const entity = CategoryModelMapper.toEntity(model);
    expect(entity.toJSON()).toStrictEqual(
      new Category(
        {
          name: "Category 1",
          description: "Category 1 description",
          is_active: true,
          created_at,
        },
        new UniqueEntityId("9366b7dc-2d71-4799-b91c-c64adb205104")
      ).toJSON()
    );
  });
});
