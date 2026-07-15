import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryBodyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
