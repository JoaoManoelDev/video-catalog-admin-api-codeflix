import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface CategoryProps {
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: Date;
}

export class Category extends Entity<CategoryProps> {
  static create(
    props: Optional<CategoryProps, "createdAt">,
    id?: UniqueEntityId,
  ) {
    const category = new Category(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return category;
  }

  changeName(name: string): void {
    this.props.name = name;
  }

  changeDescription(description: string): void {
    this.props.description = description;
  }

  activate(): void {
    this.props.isActive = true;
  }

  deactivate(): void {
    this.props.isActive = false;
  }

  toJSON() {
    return {
      id: this.id.toString(),
      name: this.props.name,
      description: this.props.description,
      isActive: this.props.isActive,
      createdAt: this.props.createdAt,
    };
  }
}
