import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

import { FetchCategoriesUseCase } from "@/modules/category/application/use-cases/fetch-categories";
import { CategoryPresenter } from "@/infra/http/presenters/category-presenter";

export class FetchCategoriesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  perPage: number = 10;

  @IsOptional()
  @IsString()
  search?: string;
}

@Controller("/categories")
export class FetchCategoriesController {
  constructor(private fetchCategories: FetchCategoriesUseCase) {}

  @Get()
  async handle(@Query() query: FetchCategoriesQueryDto) {
    const { page, perPage, search } = query;

    const result = await this.fetchCategories.execute({
      page,
      perPage,
      search,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { categories, meta } = result.value;

    return {
      categories: categories.map(CategoryPresenter.toHTTP),
      meta,
    };
  }
}
