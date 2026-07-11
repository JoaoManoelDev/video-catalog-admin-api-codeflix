import { Module } from "@nestjs/common";

import { CategoryRepository } from "@/modules/category/domain/repositories/category-repository";
import { EnvModule } from "@/infra/env/env.module";

import { PrismaService } from "./prisma/prisma.service";
import { PrismaCategoryRepository } from "./prisma/repositories/prisma-category-repository";

@Module({
  imports: [EnvModule],
  providers: [
    PrismaService,
    {
      provide: CategoryRepository,
      useClass: PrismaCategoryRepository,
    },
  ],
  exports: [PrismaService, CategoryRepository],
})
export class DatabaseModule {}
