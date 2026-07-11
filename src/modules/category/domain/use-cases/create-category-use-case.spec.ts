import { InMemoryCategoryRepository } from "../../test/repositories/in-memory-category-repository";
import { CreateCategoryUseCase } from "./create-category-use-case";
import { Category } from "../entities/category-entity";

let inMemoryCategoryRepository: InMemoryCategoryRepository;

let sut: CreateCategoryUseCase;

describe("Create Category Use Case", () => {
  beforeEach(() => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository();

    sut = new CreateCategoryUseCase(inMemoryCategoryRepository);
  });

  it("should be able to create a new category", async () => {
    const result = await sut.execute({
      name: "Category 1",
      description: "Category 1 description",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      category: inMemoryCategoryRepository.categories[0],
    });
  });

  it("should not be able to create a category with invalid name", async () => {
    const result = await sut.execute({
      name: "ab",
      description: "Category 1 description",
    });

    expect(result.isLeft()).toBe(true);

    if (result.isLeft()) {
      expect(result.value.toJSON()).toEqual(
        expect.arrayContaining([
          {
            name: ["name must be longer than or equal to 3 characters"],
          },
        ]),
      );
    }

    expect(inMemoryCategoryRepository.categories).toHaveLength(0);
  });

  it("should not be able to create a category with an existing name", async () => {
    await inMemoryCategoryRepository.create(
      Category.create({
        name: "Category 1",
        description: "Category 1 description",
      }),
    );

    const result = await sut.execute({
      name: "Category 1",
      description: "Category 1 description",
    });

    expect(result.isLeft()).toBe(true);

    if (result.isLeft()) {
      expect(result.value.toJSON()).toEqual(
        expect.arrayContaining([
          {
            name: ["name must be unique"],
          },
        ]),
      );
    }

    expect(inMemoryCategoryRepository.categories).toHaveLength(1);
  });
});
