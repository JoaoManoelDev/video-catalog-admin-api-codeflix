import { Category } from "@/modules/category/domain/entities/category-entity";

export class CategoryPresenter {
  static toHTTP(category: Category) {
    return category.toJSON();
  }
}
