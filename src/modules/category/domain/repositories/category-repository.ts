import { IPaginatedResult } from "@/shared/repositories/paginated-result";
import { IQueryParams } from "@/shared/repositories/query-params";
import { Category } from "../entities/category";

export abstract class CategoryRepository {
  abstract create(category: Category): Promise<Category>;
  abstract findByName(name: string): Promise<Category | null>;
  abstract findAll(queryParams?: IQueryParams): Promise<IPaginatedResult<Category>>;
}
