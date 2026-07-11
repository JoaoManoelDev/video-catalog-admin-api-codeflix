import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { CategoryRepository } from "@/modules/category/domain/repositories/category-repository";
import { CategoryFactory, makeCategory } from "@/modules/category/test/factories/make-category";

describe("Prisma Category Repository (E2E)", () => {
  let app: INestApplication;
  let categoryRepository: CategoryRepository;
  let categoryFactory: CategoryFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CategoryFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    categoryRepository = moduleRef.get(CategoryRepository);
    categoryFactory = moduleRef.get(CategoryFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should create and find a category by name", async () => {
    const category = makeCategory({
      name: `Repo Create ${Date.now()}`,
      description: "Created via repository",
    });

    await categoryRepository.create(category);

    const found = await categoryRepository.findByName(category.toJSON().name);

    expect(found).toBeTruthy();
    expect(found?.id.toString()).toBe(category.id.toString());
    expect(found?.toJSON().description).toBe("Created via repository");
  });

  it("should list categories with search and pagination", async () => {
    const prefix = `RepoList-${Date.now()}`;

    await Promise.all([
      categoryFactory.makePrismaCategory({ name: `${prefix}-One` }),
      categoryFactory.makePrismaCategory({ name: `${prefix}-Two` }),
      categoryFactory.makePrismaCategory({ name: `${prefix}-Three` }),
    ]);

    const result = await categoryRepository.findAll({
      page: 1,
      perPage: 2,
      search: prefix,
    });

    expect(result.items).toHaveLength(2);
    expect(result.meta).toEqual(
      expect.objectContaining({
        page: 1,
        perPage: 2,
        total: 3,
        totalPages: 2,
      }),
    );
  });
});
