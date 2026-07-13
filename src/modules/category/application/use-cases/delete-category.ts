import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/shared/errors/either";
import { ResourceNotFoundError } from "@/shared/errors/resource-not-found-error";
import { CategoryRepository } from "@/modules/category/domain/repositories/category-repository";

interface IDeleteCategoryRequest {
  id: string;
}

type IDeleteCategoryResponse = Either<ResourceNotFoundError, null>;

@Injectable()
export class DeleteCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({
    id,
  }: IDeleteCategoryRequest): Promise<IDeleteCategoryResponse> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      return left(new ResourceNotFoundError("Category not found"));
    }

    await this.categoryRepository.delete(category);

    return right(null);
  }
}
