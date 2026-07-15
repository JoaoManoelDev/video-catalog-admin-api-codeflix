import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator";

export class UpdateCategoryBodyDto {
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
