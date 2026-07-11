import { Category } from "@/modules/category/domain/entities/category";

export class CategoryPresenter {
  static toHTTP(category: Category) {
    return category.toJSON();
  }
}
