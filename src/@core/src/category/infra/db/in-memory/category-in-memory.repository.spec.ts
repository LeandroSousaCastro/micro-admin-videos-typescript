import { Category } from "#category/domain/entities/category";
import { CategoryFakeBuilder } from "#category/domain/entities/category-fake-builder";
import CategoryInMemoryRepository from "./category-in-memory.repository";

describe("CategoryInMemoryRepository", () => {
  let repository: CategoryInMemoryRepository;
  let categoryFake: CategoryFakeBuilder;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    categoryFake = CategoryFakeBuilder.aCategory();
  });
  it("should no filter items when filter object is null", async () => {
    const items = [categoryFake.build()];
    const filterSpy = jest.spyOn(items, "filter" as any);
    let itemsFiltered = await repository["applyFilter"](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });

  it("should filter items using filter parameter", async () => {
    const items = [
      categoryFake.withName("test").build(),
      categoryFake.withName("TEST").build(),
      categoryFake.withName("fake").build(),
    ];
    const filterSpy = jest.spyOn(items, "filter" as any);

    let itemsFiltered = await repository["applyFilter"](items, "TEST");
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
  });

  it("should sort by created_at when sort param is null", async () => {
    const faker = categoryFake;
    const created_at = new Date();
    const items = [
      categoryFake.withName("test").withCreatedAt(created_at).build(),
      faker
        .withName("TEST")
        .withCreatedAt(new Date(created_at.getTime() + 100))
        .build(),
      faker
        .withName("fake")
        .withCreatedAt(new Date(created_at.getTime() + 200))
        .build(),
    ];

    let itemsSorted = await repository["applySort"](items, null, null);
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
  });

  it("should sort by name", async () => {
    const faker = categoryFake;
    const items = [
      categoryFake.withName("c").build(),
      categoryFake.withName("b").build(),
      categoryFake.withName("a").build(),
    ];

    let itemsSorted = await repository["applySort"](items, "name", "asc");
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

    itemsSorted = await repository["applySort"](items, "name", "desc");
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);
  });
});
