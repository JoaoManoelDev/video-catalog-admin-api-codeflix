import { config } from "dotenv";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";

config({ path: ".env" });
config({ path: ".env.test", override: true });

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please provide a DATABASE_URL environment variable");
  }

  const url = new URL(process.env.DATABASE_URL);
  
  url.searchParams.set("schema", schemaId);
  
  return url.toString();
}

const schemaId = randomUUID();

let prisma: PrismaClient;

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId);

  process.env.DATABASE_URL = databaseURL;

  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
    env: process.env,
  });

  const adapter = new PrismaPg(databaseURL, { schema: schemaId });

  prisma = new PrismaClient({ adapter });
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
