import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/shared/errors/either";
import { ResourceNotFoundError } from "@/shared/errors/resource-not-found-error";
import { ValidationErrors } from "@/shared/validators/validation-errors";
import { Category } from "@/modules/category/domain/entities/category";
import { CategoryRepository } from "@/modules/category/domain/repositories/category-repository";

interface IUpdateCategoryRequest {
  id: string;
  name?: string;
  description?: string;
  isActive?: boolean;
}

type IUpdateCategoryResponse = Either<
  ResourceNotFoundError | ValidationErrors,
  {
    category: Category;
  }
>;

@Injectable()
export class UpdateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({
    id,
    name,
    description,
    isActive,
  }: IUpdateCategoryRequest): Promise<IUpdateCategoryResponse> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      return left(new ResourceNotFoundError("Category not found"));
    }

    if (name !== undefined) {
      const categoryByName = await this.categoryRepository.findByName(name);

      if (categoryByName && categoryByName.id.toString() !== id) {
        const validationErrors = new ValidationErrors();
        validationErrors.addError("name must be unique", "name");
        return left(validationErrors);
      }
    }

    category.update({ name, description, isActive });

    if (category.validationErrors.hasErrors()) {
      return left(category.validationErrors);
    }

    await this.categoryRepository.save(category);

    return right({ category });
  }
}
