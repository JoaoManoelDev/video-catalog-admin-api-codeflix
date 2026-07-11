import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EnvModule } from "./env/env.module";
import { validateEnv } from "./env/env";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateEnv,
      isGlobal: true,
    }),
    EnvModule,
  ],
})
export class AppModule {}
