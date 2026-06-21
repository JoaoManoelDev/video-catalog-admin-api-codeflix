import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Category,
  CategoryProps,
} from "@/module/category/domain/entities/category.entity";

export const makeCategory = (
  override: Partial<CategoryProps> = {},
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
