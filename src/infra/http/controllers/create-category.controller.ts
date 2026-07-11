import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { IsOptional, IsString } from "class-validator";

import { CreateCategoryUseCase } from "@/modules/category/domain/use-cases/create-category-use-case";

export class CreateCategoryBodyDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

@Controller("/categories")
export class CreateCategoryController {
  constructor(private createCategory: CreateCategoryUseCase) {}

  @Post()
  async handle(@Body() body: CreateCategoryBodyDto) {
    const { name, description } = body;

    const result = await this.createCategory.execute({
      name,
      description,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.toJSON());
    }
  }
}
