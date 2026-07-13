import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { CategoryFactory } from "@/modules/category/test/factories/make-category";

describe("Get category by id (E2E)", () => {
  let app: INestApplication;
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

    categoryFactory = moduleRef.get(CategoryFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[GET] /categories/:id", async () => {
    const category = await categoryFactory.makePrismaCategory({
      name: `Get By Id ${Date.now()}`,
      description: "Category description",
    });

    const response = await request(app.getHttpServer()).get(
      `/categories/${category.id.toString()}`,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      category: expect.objectContaining({
        id: category.id.toString(),
        name: category.toJSON().name,
        description: "Category description",
        isActive: true,
      }),
    });
  });

  test("[GET] /categories/:id — not found", async () => {
    const response = await request(app.getHttpServer()).get(
      "/categories/00000000-0000-0000-0000-000000000000",
    );

    expect(response.statusCode).toBe(404);
  });
});
