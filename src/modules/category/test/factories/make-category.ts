import { UniqueEntityID } from "@/shared/entities/unique-entity-id";
import {
  Category,
  ICategoryProps,
} from "@/modules/category/domain/entities/category-entity";

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
