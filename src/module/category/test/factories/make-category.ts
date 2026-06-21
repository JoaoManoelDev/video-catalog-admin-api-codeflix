import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  Category,
  CategoryProps,
} from "@/module/category/domain/entities/category.entity";

export const makeCategory = (
  override: Partial<CategoryProps> = {},
  id?: UniqueEntityId,
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
