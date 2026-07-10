import { Either, right } from "@/shared/errors/either";
import { IPaginationMeta } from "@/shared/repositories/paginated-result";
import { Category } from "../entities/category-entity";
import { CategoryRepository } from "../repositories/category-repository";

interface IFetchCategoriesRequest {
  page?: number;
  perPage?: number;
  search?: string;
}

type IFetchCategoriesResponse = Either<
  null,
  {
    categories: Category[];
    meta: IPaginationMeta;
  }
>;

export class FetchCategoriesUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({
    page = 1,
    perPage = 10,
    search,
  }: IFetchCategoriesRequest): Promise<IFetchCategoriesResponse> {
    const { items, meta } = await this.categoryRepository.findAll({
      page,
      perPage,
      search,
    });

    return right({ categories: items, meta });
  }
}
