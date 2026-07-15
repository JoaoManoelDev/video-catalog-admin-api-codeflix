import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

describe("Create category (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[POST] /categories", async () => {
    const name = `Movies-${Date.now()}`;

    const response = await request(app.getHttpServer()).post("/categories").send({
      name,
      description: "Movie category",
    });

    expect(response.statusCode).toBe(201);

    const categoryOnDatabase = await prisma.category.findFirst({
      where: {
        name,
      },
    });

    expect(categoryOnDatabase).toBeTruthy();
    expect(categoryOnDatabase?.description).toBe("Movie category");
    expect(categoryOnDatabase?.isActive).toBe(true);
  });

  test("[POST] /categories — with isActive false", async () => {
    const name = `Inactive-${Date.now()}`;

    const response = await request(app.getHttpServer()).post("/categories").send({
      name,
      description: "Inactive category",
      isActive: false,
    });

    expect(response.statusCode).toBe(201);

    const categoryOnDatabase = await prisma.category.findFirst({
      where: {
        name,
      },
    });

    expect(categoryOnDatabase).toBeTruthy();
    expect(categoryOnDatabase?.isActive).toBe(false);
  });

  test("[POST] /categories — invalid name", async () => {
    const response = await request(app.getHttpServer()).post("/categories").send({
      name: "ab",
    });

    expect(response.statusCode).toBe(400);
  });

  test("[POST] /categories — empty name", async () => {
    const response = await request(app.getHttpServer()).post("/categories").send({
      name: "",
    });

    expect(response.statusCode).toBe(400);
  });

  test("[POST] /categories — duplicate name", async () => {
    const name = `Series-${Date.now()}`;

    await request(app.getHttpServer()).post("/categories").send({
      name,
      description: "Series category",
    });

    const response = await request(app.getHttpServer()).post("/categories").send({
      name,
      description: "Another series",
    });

    expect(response.statusCode).toBe(400);
  });
});
