import { plainToInstance, Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, validateSync } from "class-validator";

export type EnvVariables = {
  [K in keyof Env]: Env[K];
};

export class Env {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  PORT: number = 3333;

  @IsString()
  DATABASE_URL: string;
}

export function validateEnv(config: Record<string, unknown>): Env {
  const validatedConfig = plainToInstance(Env, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
