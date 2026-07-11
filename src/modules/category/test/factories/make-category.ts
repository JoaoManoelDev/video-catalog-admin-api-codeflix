import { Injectable } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { randomUUID } from "node:crypto";

import { UniqueEntityID } from "@/shared/entities/unique-entity-id";
import {
  Category,
  ICategoryProps,
} from "@/modules/category/domain/entities/category";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaCategoryMapper } from "@/infra/database/prisma/mappers/prisma-category-mapper";

export const makeCategory = (
  override: Partial<ICategoryProps> = {},
  id?: UniqueEntityID,
) => {
  const category = Category.create(
    {
      name: "New Category",
      description: "New Category description",
      isActive: true,
      ...override,
    },
    id,
  );

  return category;
};

@Injectable()
export class CategoryFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCategory(
    data: Partial<ICategoryProps> = {},
  ): Promise<Category> {
    const category = makeCategory({
      name: faker.commerce.department() + " " + randomUUID().slice(0, 8),
      description: faker.lorem.sentence(),
      ...data,
    });

    await this.prisma.category.create({
      data: PrismaCategoryMapper.toPrisma(category),
    });

    return category;
  }
}
