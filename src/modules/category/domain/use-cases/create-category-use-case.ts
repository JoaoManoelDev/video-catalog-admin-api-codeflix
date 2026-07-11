import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/shared/errors/either";
import { ValidationErrors } from "@/shared/validators/validation-errors";
import { Category } from "../entities/category-entity";
import { CategoryRepository } from "../repositories/category-repository";

interface ICreateCategoryRequest {
  name: string;
  description?: string;
}

type ICreateCategoryResponse = Either<
  ValidationErrors,
  {
    category: Category;
  }
>;

@Injectable()
export class CreateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({
    name,
    description,
  }: ICreateCategoryRequest): Promise<ICreateCategoryResponse> {
    const categoryByName = await this.categoryRepository.findByName(name);

    if (categoryByName) {
      const validationErrors = new ValidationErrors();
      validationErrors.addError("name must be unique", "name");
      return left(validationErrors);
    }

    const category = Category.create({
      name,
      description,
    });

    if (category.validationErrors.hasErrors()) {
      return left(category.validationErrors);
    }

    await this.categoryRepository.create(category);

    return right({ category });
  }
}
