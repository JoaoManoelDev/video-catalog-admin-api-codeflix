import { UniqueEntityID } from "@/shared/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/shared/errors/resource-not-found-error";
import { makeCategory } from "../../test/factories/make-category";
import { InMemoryCategoryRepository } from "../../test/repositories/in-memory-category-repository";
import { DeleteCategoryUseCase } from "./delete-category";

let inMemoryCategoryRepository: InMemoryCategoryRepository;

let sut: DeleteCategoryUseCase;

describe("Delete Category Use Case", () => {
  beforeEach(() => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository();

    sut = new DeleteCategoryUseCase(inMemoryCategoryRepository);
  });

  it("should be able to delete a category", async () => {
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
    expect(inMemoryCategoryRepository.categories).toHaveLength(0);
  });

  it("should not be able to delete a category that does not exist", async () => {
    const result = await sut.execute({
      id: "non-existent-id",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
