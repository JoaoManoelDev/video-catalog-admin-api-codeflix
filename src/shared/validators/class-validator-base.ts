import { validateSync, ValidationError } from "class-validator";

import { IFieldsValidator, IValidateFieldsParams } from "./fields-validator";
import { ValidationErrors } from "./validation-errors";

export class ClassValidatorBase<T extends object = object> implements IFieldsValidator<T> {
  validate({ errors, data, fields }: IValidateFieldsParams<T>): boolean {
    const validationErrors = validateSync(data, {
      groups: fields,
    });

    this.collectErrors(errors, validationErrors);

    return validationErrors.length === 0;
  }

  protected collectErrors(
    errors: ValidationErrors,
    validationErrors: ValidationError[],
    parentField?: string,
  ): void {
    for (const error of validationErrors) {
      const field = parentField
        ? `${parentField}.${error.property}`
        : error.property;

      if (error.constraints) {
        for (const message of Object.values(error.constraints)) {
          errors.addError(message, field);
        }
      }

      if (error.children?.length) {
        this.collectErrors(errors, error.children, field);
      }
    }
  }
}
