import { Entity } from "@/shared/entities/entity";
import { UniqueEntityID } from "@/shared/entities/unique-entity-id";
import { Optional } from "@/shared/types/optional";
import { CategoryValidator } from "../validators/category-validator";

export interface ICategoryProps {
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: Date;
}

export class Category extends Entity<ICategoryProps> {
  static create(
    props: Optional<ICategoryProps, "createdAt" | "isActive">,
    id?: UniqueEntityID,
  ) {
    const category = new Category(
      {
        ...props,
        isActive: props.isActive ?? true,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    const { name, description, isActive } = category.toJSON();

    CategoryValidator.validate({
      errors: category.validationErrors,
      data: { name, description, isActive },
    });

    return category;
  }

  changeName(name: string): void {
    this.props.name = name;
  }

  changeDescription(description: string | null): void {
    this.props.description = description;
  }

  activate(): void {
    this.props.isActive = true;
  }

  deactivate(): void {
    this.props.isActive = false;
  }

  update(props: {
    name?: string;
    description?: string | null;
    isActive?: boolean;
  }): void {
    if (props.name !== undefined) {
      this.changeName(props.name);
    }

    if (props.description !== undefined) {
      this.changeDescription(props.description);
    }

    if (props.isActive !== undefined) {
      if (props.isActive) {
        this.activate();
      } else {
        this.deactivate();
      }
    }

    this.validationErrors.clear();

    const { name, description, isActive } = this.toJSON();

    CategoryValidator.validate({
      errors: this.validationErrors,
      data: { name, description, isActive },
    });
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
