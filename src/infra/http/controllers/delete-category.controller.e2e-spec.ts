import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { CategoryFactory } from "@/modules/category/test/factories/make-category";

describe("Delete category (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let categoryFactory: CategoryFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CategoryFactory],
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
    categoryFactory = moduleRef.get(CategoryFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[DELETE] /categories/:id", async () => {
    const category = await categoryFactory.makePrismaCategory({
      name: `To Delete ${Date.now()}`,
    });

    const response = await request(app.getHttpServer()).delete(
      `/categories/${category.id.toString()}`,
    );

    expect(response.statusCode).toBe(204);

    const categoryOnDatabase = await prisma.category.findUnique({
      where: {
        id: category.id.toString(),
      },
    });

    expect(categoryOnDatabase).toBeNull();
  });

  test("[DELETE] /categories/:id — not found", async () => {
    const response = await request(app.getHttpServer()).delete(
      "/categories/00000000-0000-0000-0000-000000000000",
    );

    expect(response.statusCode).toBe(404);
  });
});
