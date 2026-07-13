import {
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
} from "@nestjs/common";

import { DeleteCategoryUseCase } from "@/modules/category/application/use-cases/delete-category";

@Controller("/categories/:id")
export class DeleteCategoryController {
  constructor(private deleteCategory: DeleteCategoryUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param("id") id: string) {
    const result = await this.deleteCategory.execute({ id });

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message);
    }
  }
}
