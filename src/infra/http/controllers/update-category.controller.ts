import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
} from "@nestjs/common";

import { UpdateCategoryUseCase } from "@/modules/category/application/use-cases/update-category";
import { ResourceNotFoundError } from "@/shared/errors/resource-not-found-error";

import { UpdateCategoryBodyDto } from "../dtos/update-category-body.dto";

@Controller("/categories/:id")
export class UpdateCategoryController {
  constructor(private updateCategory: UpdateCategoryUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param("id") id: string,
    @Body() body: UpdateCategoryBodyDto,
  ) {
    const { name, description, isActive } = body;

    const result = await this.updateCategory.execute({
      id,
      name,
      description,
      isActive,
    });

    if (result.isLeft()) {
      if (result.value instanceof ResourceNotFoundError) {
        throw new NotFoundException(result.value.message);
      }

      throw new BadRequestException(result.value.toJSON());
    }
  }
}
