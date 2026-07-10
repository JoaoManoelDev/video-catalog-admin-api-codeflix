import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryCategoryRepository } from "../../test/repositories/in-memory-category-repository";
import { FetchCategoriesUseCase } from "./fetch-categories-use-case";
import { Category } from "../entities/category-entity";

let inMemoryCategoryRepository: InMemoryCategoryRepository;

let sut: FetchCategoriesUseCase;

describe("Fetch Categories Use Case", () => {
  beforeEach(() => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository();
    sut = new FetchCategoriesUseCase(inMemoryCategoryRepository);
  });

  it("should be able to fetch paginated categories", async () => {
    for (let i = 1; i <= 22; i++) {
      const category = Category.create({
        name: `Category ${i}`,
        description: `Category ${i} description`,
      });

      inMemoryCategoryRepository.create(category);
    }

    const result = await sut.execute({
      page: 3,
      perPage: 10,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.categories).toHaveLength(2);
      expect(result.value.meta).toEqual({
        page: 3,
        perPage: 10,
        total: 22,
        totalPages: 3,
      });
    }
  });

  it("should be able to search categories by filter", async () => {
    const categories = ["Movies", "Series", "Movies Premium", "Documentaries"];

    for (let i = 0; i < categories.length; i++) {
      const name = categories[i];
    
      inMemoryCategoryRepository.create(
        Category.create({
          name,
          description: `${name} description`,
        }),
      );
    }

    const result = await sut.execute({
      search: "Movies",
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.categories).toHaveLength(2);
      expect(
        result.value.categories.map((category) => category.toJSON().name),
      ).toEqual(expect.arrayContaining(["Movies", "Movies Premium"]));
      expect(result.value.meta).toEqual({
        page: 1,
        perPage: 10,
        total: 2,
        totalPages: 1,
      });
    }
  });

  it("should be able not pass page and perPage to fetch all categories", async () => {
    for (let i = 1; i <= 22; i++) {
      const category = Category.create({
        name: `Category ${i}`,
        description: `Category ${i} description`,
      });

      inMemoryCategoryRepository.create(category);
    }

    const result = await sut.execute({});

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.categories).toHaveLength(10);
      expect(result.value.meta).toEqual({
        page: 1,
        perPage: 10,
        total: 22,
        totalPages: 3,
      });
    }
  });
});
