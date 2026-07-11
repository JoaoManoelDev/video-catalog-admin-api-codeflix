import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { DatabaseModule } from "./database/database.module";
import { EnvModule } from "./env/env.module";
import { validateEnv } from "./env/env";
import { HttpModule } from "./http/http.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateEnv,
      isGlobal: true,
    }),
    EnvModule,
    DatabaseModule,
    HttpModule,
  ],
})
export class AppModule {}
