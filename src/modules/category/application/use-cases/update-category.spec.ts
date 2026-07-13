import { UniqueEntityID } from "@/shared/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/shared/errors/resource-not-found-error";
import { ValidationErrors } from "@/shared/validators/validation-errors";
import { makeCategory } from "../../test/factories/make-category";
import { InMemoryCategoryRepository } from "../../test/repositories/in-memory-category-repository";
import { UpdateCategoryUseCase } from "./update-category";

let inMemoryCategoryRepository: InMemoryCategoryRepository;

let sut: UpdateCategoryUseCase;

describe("Update Category Use Case", () => {
  beforeEach(() => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository();

    sut = new UpdateCategoryUseCase(inMemoryCategoryRepository);
  });

  it("should be able to update a category", async () => {
    const category = makeCategory(
      {
        name: "Category 1",
        description: "Category 1 description",
        isActive: true,
      },
      new UniqueEntityID("category-1"),
    );

    await inMemoryCategoryRepository.create(category);

    const result = await sut.execute({
      id: "category-1",
      name: "Updated Category",
      description: "Updated description",
      isActive: false,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      category: inMemoryCategoryRepository.categories[0],
    });
    expect(inMemoryCategoryRepository.categories[0].toJSON()).toEqual(
      expect.objectContaining({
        name: "Updated Category",
        description: "Updated description",
        isActive: false,
      }),
    );
  });

  it("should not be able to update a category that does not exist", async () => {
    const result = await sut.execute({
      id: "non-existent-id",
      name: "Updated Category",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to update a category with invalid name", async () => {
    const category = makeCategory(
      {
        name: "Category 1",
      },
      new UniqueEntityID("category-1"),
    );

    await inMemoryCategoryRepository.create(category);

    const result = await sut.execute({
      id: "category-1",
      name: "ab",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ValidationErrors);

    if (result.value instanceof ValidationErrors) {
      expect(result.value.toJSON()).toEqual(
        expect.arrayContaining([
          {
            name: ["name must be longer than or equal to 3 characters"],
          },
        ]),
      );
    }
  });

  it("should not be able to update a category with an existing name", async () => {
    await inMemoryCategoryRepository.create(
      makeCategory(
        {
          name: "Category 1",
        },
        new UniqueEntityID("category-1"),
      ),
    );

    await inMemoryCategoryRepository.create(
      makeCategory(
        {
          name: "Category 2",
        },
        new UniqueEntityID("category-2"),
      ),
    );

    const result = await sut.execute({
      id: "category-2",
      name: "Category 1",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ValidationErrors);

    if (result.value instanceof ValidationErrors) {
      expect(result.value.toJSON()).toEqual(
        expect.arrayContaining([
          {
            name: ["name must be unique"],
          },
        ]),
      );
    }

    expect(inMemoryCategoryRepository.categories[1].toJSON().name).toBe(
      "Category 2",
    );
  });

  it("should be able to update a category keeping the same name", async () => {
    await inMemoryCategoryRepository.create(
      makeCategory(
        {
          name: "Category 1",
          description: "Old description",
        },
        new UniqueEntityID("category-1"),
      ),
    );

    const result = await sut.execute({
      id: "category-1",
      name: "Category 1",
      description: "New description",
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.category.toJSON()).toEqual(
        expect.objectContaining({
          name: "Category 1",
          description: "New description",
        }),
      );
    }
  });

  it("should be able to update a category without changing the name", async () => {
    await inMemoryCategoryRepository.create(
      makeCategory(
        {
          name: "Category 1",
          description: "Old description",
          isActive: true,
        },
        new UniqueEntityID("category-1"),
      ),
    );

    const result = await sut.execute({
      id: "category-1",
      description: "New description",
      isActive: false,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.category.toJSON()).toEqual(
        expect.objectContaining({
          name: "Category 1",
          description: "New description",
          isActive: false,
        }),
      );
    }
  });
});
