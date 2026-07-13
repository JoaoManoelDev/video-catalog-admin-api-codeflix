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

  it("should find a category by id", async () => {
    const category = await categoryFactory.makePrismaCategory({
      name: `Repo FindById ${Date.now()}`,
      description: "Find by id",
    });

    const found = await categoryRepository.findById(category.id.toString());

    expect(found).toBeTruthy();
    expect(found?.id.toString()).toBe(category.id.toString());
    expect(found?.toJSON().name).toBe(category.toJSON().name);
    expect(found?.toJSON().description).toBe("Find by id");
  });

  it("should return null when category id does not exist", async () => {
    const found = await categoryRepository.findById(
      "00000000-0000-0000-0000-000000000000",
    );

    expect(found).toBeNull();
  });

  it("should save an updated category", async () => {
    const category = await categoryFactory.makePrismaCategory({
      name: `Repo Save ${Date.now()}`,
      description: "Before update",
      isActive: true,
    });

    category.update({
      name: `Repo Save Updated ${Date.now()}`,
      description: "After update",
      isActive: false,
    });

    await categoryRepository.save(category);

    const found = await categoryRepository.findById(category.id.toString());

    expect(found?.toJSON()).toEqual(
      expect.objectContaining({
        name: category.toJSON().name,
        description: "After update",
        isActive: false,
      }),
    );
  });

  it("should delete a category", async () => {
    const category = await categoryFactory.makePrismaCategory({
      name: `Repo Delete ${Date.now()}`,
    });

    await categoryRepository.delete(category);

    const found = await categoryRepository.findById(category.id.toString());

    expect(found).toBeNull();
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
