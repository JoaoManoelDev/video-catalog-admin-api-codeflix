import { Module } from "@nestjs/common";

import { CreateCategoryUseCase } from "@/modules/category/domain/use-cases/create-category-use-case";
import { FetchCategoriesUseCase } from "@/modules/category/domain/use-cases/fetch-categories-use-case";
import { DatabaseModule } from "@/infra/database/database.module";

import { CreateCategoryController } from "./controllers/create-category.controller";
import { FetchCategoriesController } from "./controllers/fetch-categories.controller";

@Module({
  imports: [DatabaseModule],
  controllers: [CreateCategoryController, FetchCategoriesController],
  providers: [CreateCategoryUseCase, FetchCategoriesUseCase],
})
export class HttpModule {}
