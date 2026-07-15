import { BadRequestException, Body, Controller, Post } from "@nestjs/common";

import { CreateCategoryUseCase } from "@/modules/category/application/use-cases/create-category";

import { CreateCategoryBodyDto } from "../dtos/create-category-body.dto";

@Controller("/categories")
export class CreateCategoryController {
  constructor(private createCategory: CreateCategoryUseCase) {}

  @Post()
  async handle(@Body() body: CreateCategoryBodyDto) {
    const { name, description, isActive } = body;

    const result = await this.createCategory.execute({
      name,
      description,
      isActive,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.toJSON());
    }
  }
}
