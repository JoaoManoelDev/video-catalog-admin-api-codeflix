import { Module } from "@nestjs/common";

import { CreateCategoryUseCase } from "@/modules/category/application/use-cases/create-category";
import { DeleteCategoryUseCase } from "@/modules/category/application/use-cases/delete-category";
import { FetchCategoriesUseCase } from "@/modules/category/application/use-cases/fetch-categories";
import { GetCategoryByIdUseCase } from "@/modules/category/application/use-cases/get-category-by-id";
import { UpdateCategoryUseCase } from "@/modules/category/application/use-cases/update-category";
import { DatabaseModule } from "@/infra/database/database.module";

import { CreateCategoryController } from "./controllers/create-category.controller";
import { DeleteCategoryController } from "./controllers/delete-category.controller";
import { FetchCategoriesController } from "./controllers/fetch-categories.controller";
import { GetCategoryByIdController } from "./controllers/get-category-by-id.controller";
import { UpdateCategoryController } from "./controllers/update-category.controller";

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateCategoryController,
    FetchCategoriesController,
    GetCategoryByIdController,
    UpdateCategoryController,
    DeleteCategoryController,
  ],
  providers: [
    CreateCategoryUseCase,
    FetchCategoriesUseCase,
    GetCategoryByIdUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
  ],
})
export class HttpModule {}
