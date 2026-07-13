import { UniqueEntityID } from "@/shared/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/shared/errors/resource-not-found-error";
import { makeCategory } from "../../test/factories/make-category";
import { InMemoryCategoryRepository } from "../../test/repositories/in-memory-category-repository";
import { GetCategoryByIdUseCase } from "./get-category-by-id";

let inMemoryCategoryRepository: InMemoryCategoryRepository;

let sut: GetCategoryByIdUseCase;

describe("Get Category By Id Use Case", () => {
  beforeEach(() => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository();

    sut = new GetCategoryByIdUseCase(inMemoryCategoryRepository);
  });

  it("should be able to get a category by id", async () => {
    const category = makeCategory(
      {
        name: "Category 1",
      },
      new UniqueEntityID("category-1"),
    );

    await inMemoryCategoryRepository.create(category);

    const result = await sut.execute({
      id: "category-1",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      category,
    });
  });

  it("should not be able to get a category that does not exist", async () => {
    const result = await sut.execute({
      id: "non-existent-id",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
