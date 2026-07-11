import { Module } from "@nestjs/common";

import { CreateCategoryUseCase } from "@/modules/category/application/use-cases/create-category";
import { FetchCategoriesUseCase } from "@/modules/category/application/use-cases/fetch-categories";
import { DatabaseModule } from "@/infra/database/database.module";

import { CreateCategoryController } from "./controllers/create-category.controller";
import { FetchCategoriesController } from "./controllers/fetch-categories.controller";

@Module({
  imports: [DatabaseModule],
  controllers: [CreateCategoryController, FetchCategoriesController],
  providers: [CreateCategoryUseCase, FetchCategoriesUseCase],
})
export class HttpModule {}
