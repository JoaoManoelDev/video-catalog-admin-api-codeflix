import {
  createPaginationMeta,
  IPaginatedResult,
} from "@/shared/repositories/paginated-result";
import { IQueryParams } from "@/shared/repositories/query-params";
import { Category } from "../../domain/entities/category-entity";
import { CategoryRepository } from "../../domain/repositories/category-repository";

export class InMemoryCategoryRepository implements CategoryRepository {
  public categories: Category[] = [];

  async create(category: Category): Promise<Category> {
    this.categories.push(category);

    return category;
  }

  async findByName(name: string): Promise<Category | null> {
    const category = this.categories.find(
      (category) => category.toJSON().name === name,
    );

    return category ?? null;
  }

  async findAll({
    page = 1,
    perPage = 10,
    search,
  }: IQueryParams = {}): Promise<IPaginatedResult<Category>> {
    const filteredCategories = search
      ? this.categories.filter((category) =>
          category.toJSON().name.toLowerCase().includes(search.toLowerCase()),
        )
      : this.categories;

    const items = filteredCategories.slice(
      (page - 1) * perPage,
      page * perPage,
    );

    return {
      items,
      meta: createPaginationMeta(page, perPage, filteredCategories.length),
    };
  }
}
