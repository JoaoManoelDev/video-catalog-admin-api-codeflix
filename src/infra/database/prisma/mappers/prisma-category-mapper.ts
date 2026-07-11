import { UniqueEntityID } from "@/shared/entities/unique-entity-id";
import { Category } from "@/modules/category/domain/entities/category";
import { Category as PrismaCategory, Prisma } from "@/generated/prisma/client";

export class PrismaCategoryMapper {
  static toDomain(raw: PrismaCategory): Category {
    return Category.create(
      {
        name: raw.name,
        description: raw.description,
        isActive: raw.isActive,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(category: Category): Prisma.CategoryUncheckedCreateInput {
    const data = category.toJSON();

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      isActive: data.isActive,
      createdAt: data.createdAt,
    };
  }
}
