import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export interface ICategoryFields {
  name: string;
  description?: string | null;
  isActive: boolean;
}

export class CategoryRules {
  @MaxLength(255, { groups: ["name"] })
  @MinLength(3, { groups: ["name"] })
  @IsString({ groups: ["name"] })
  @IsNotEmpty({ groups: ["name"] })
  name!: string;

  @IsString({ groups: ["description"] })
  @IsOptional({ groups: ["description"] })
  description?: string | null;

  @IsBoolean({ groups: ["isActive"] })
  @IsNotEmpty({ groups: ["isActive"] })
  isActive!: boolean;

  constructor(data: ICategoryFields) {
    Object.assign(this, data);
  }
}
