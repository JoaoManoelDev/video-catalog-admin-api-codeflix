import { Controller, Get, NotFoundException, Param } from "@nestjs/common";

import { GetCategoryByIdUseCase } from "@/modules/category/application/use-cases/get-category-by-id";
import { CategoryPresenter } from "@/infra/http/presenters/category-presenter";

@Controller("/categories/:id")
export class GetCategoryByIdController {
  constructor(private getCategoryById: GetCategoryByIdUseCase) {}

  @Get()
  async handle(@Param("id") id: string) {
    const result = await this.getCategoryById.execute({ id });

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message);
    }

    return {
      category: CategoryPresenter.toHTTP(result.value.category),
    };
  }
}
