import { ClassValidatorBase } from "@/shared/validators/class-validator-base";
import { ValidationErrors } from "@/shared/validators/validation-errors";
import { CategoryRules, ICategoryFields } from "./category-rules";

export type { ICategoryFields };

export interface ICategoryValidatorParams {
  errors: ValidationErrors;
  data: ICategoryFields;
}

export class CategoryValidator extends ClassValidatorBase<CategoryRules> {
  private static readonly FIELDS = ["name", "description", "isActive"] as const;

  private static readonly instance = new CategoryValidator();

  static validate({ errors, data }: ICategoryValidatorParams): boolean {
    return CategoryValidator.instance.validate({
      errors,
      data: new CategoryRules(data),
      fields: [...CategoryValidator.FIELDS],
    });
  }
}
