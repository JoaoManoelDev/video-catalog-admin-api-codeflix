import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { CategoryFactory } from "@/modules/category/test/factories/make-category";

describe("Update category (E2E)", () => {
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

  test("[PUT] /categories/:id", async () => {
    const category = await categoryFactory.makePrismaCategory({
      name: `Before Update ${Date.now()}`,
      description: "Before description",
      isActive: true,
    });

    const updatedName = `After Update ${Date.now()}`;

    const response = await request(app.getHttpServer())
      .put(`/categories/${category.id.toString()}`)
      .send({
        name: updatedName,
        description: "After description",
        isActive: false,
      });

    expect(response.statusCode).toBe(204);

    const categoryOnDatabase = await prisma.category.findUnique({
      where: {
        id: category.id.toString(),
      },
    });

    expect(categoryOnDatabase).toEqual(
      expect.objectContaining({
        name: updatedName,
        description: "After description",
        isActive: false,
      }),
    );
  });

  test("[PUT] /categories/:id — without name", async () => {
    const originalName = `Keep Name ${Date.now()}`;

    const category = await categoryFactory.makePrismaCategory({
      name: originalName,
      description: "Before description",
      isActive: true,
    });

    const response = await request(app.getHttpServer())
      .put(`/categories/${category.id.toString()}`)
      .send({
        description: "After description",
        isActive: false,
      });

    expect(response.statusCode).toBe(204);

    const categoryOnDatabase = await prisma.category.findUnique({
      where: {
        id: category.id.toString(),
      },
    });

    expect(categoryOnDatabase).toEqual(
      expect.objectContaining({
        name: originalName,
        description: "After description",
        isActive: false,
      }),
    );
  });

  test("[PUT] /categories/:id — not found", async () => {
    const response = await request(app.getHttpServer())
      .put("/categories/00000000-0000-0000-0000-000000000000")
      .send({
        name: "Does Not Exist",
      });

    expect(response.statusCode).toBe(404);
  });

  test("[PUT] /categories/:id — invalid name", async () => {
    const category = await categoryFactory.makePrismaCategory({
      name: `Invalid Name ${Date.now()}`,
    });

    const response = await request(app.getHttpServer())
      .put(`/categories/${category.id.toString()}`)
      .send({
        name: "ab",
      });

    expect(response.statusCode).toBe(400);
  });

  test("[PUT] /categories/:id — duplicate name", async () => {
    const existing = await categoryFactory.makePrismaCategory({
      name: `Existing ${Date.now()}`,
    });

    const category = await categoryFactory.makePrismaCategory({
      name: `To Update ${Date.now()}`,
    });

    const response = await request(app.getHttpServer())
      .put(`/categories/${category.id.toString()}`)
      .send({
        name: existing.toJSON().name,
      });

    expect(response.statusCode).toBe(400);
  });

  test("[PUT] /categories/:id — unknown property", async () => {
    const category = await categoryFactory.makePrismaCategory({
      name: `Unknown Prop ${Date.now()}`,
    });

    const response = await request(app.getHttpServer())
      .put(`/categories/${category.id.toString()}`)
      .send({
        description: "Description edit",
        isActive: true,
        invalidInput: "test",
      });

    expect(response.statusCode).toBe(400);
  });
});
