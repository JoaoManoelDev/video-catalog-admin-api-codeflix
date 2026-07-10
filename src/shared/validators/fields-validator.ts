import type { ValidationErrors } from "./validation-errors";

export interface IValidateFieldsParams<Data extends object = object> {
  errors: ValidationErrors;
  data: Data;
  fields: string[];
}

export interface IFieldsValidator<T extends object = object> {
  validate(params: IValidateFieldsParams<T>): boolean;
}
