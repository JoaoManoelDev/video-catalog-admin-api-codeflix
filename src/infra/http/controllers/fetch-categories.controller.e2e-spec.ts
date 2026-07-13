import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { CategoryFactory } from "@/modules/category/test/factories/make-category";

describe("Fetch categories (E2E)", () => {
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

  test("[GET] /categories", async () => {
    const prefix = `FetchE2E-${Date.now()}`;

    await Promise.all([
      categoryFactory.makePrismaCategory({ name: `${prefix}-Action` }),
      categoryFactory.makePrismaCategory({ name: `${prefix}-Drama` }),
    ]);

    const response = await request(app.getHttpServer())
      .get("/categories")
      .query({ search: prefix, page: 1, perPage: 10 });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      categories: expect.arrayContaining([
        expect.objectContaining({ name: `${prefix}-Action` }),
        expect.objectContaining({ name: `${prefix}-Drama` }),
      ]),
      meta: expect.objectContaining({
        page: 1,
        perPage: 10,
        total: 2,
        totalPages: 1,
      }),
    });
  });
});
