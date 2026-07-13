import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/shared/errors/either";
import { ResourceNotFoundError } from "@/shared/errors/resource-not-found-error";
import { Category } from "@/modules/category/domain/entities/category";
import { CategoryRepository } from "@/modules/category/domain/repositories/category-repository";

interface IGetCategoryByIdRequest {
  id: string;
}

type IGetCategoryByIdResponse = Either<
  ResourceNotFoundError,
  {
    category: Category;
  }
>;

@Injectable()
export class GetCategoryByIdUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({
    id,
  }: IGetCategoryByIdRequest): Promise<IGetCategoryByIdResponse> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      return left(new ResourceNotFoundError("Category not found"));
    }

    return right({ category });
  }
}
