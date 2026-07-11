import { Injectable } from "@nestjs/common";

import { Category } from "@/modules/category/domain/entities/category";
import { CategoryRepository } from "@/modules/category/domain/repositories/category-repository";
import {
  createPaginationMeta,
  IPaginatedResult,
} from "@/shared/repositories/paginated-result";
import { IQueryParams } from "@/shared/repositories/query-params";

import { PrismaService } from "../prisma.service";
import { PrismaCategoryMapper } from "../mappers/prisma-category-mapper";

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private prisma: PrismaService) {}

  async create(category: Category): Promise<Category> {
    const data = PrismaCategoryMapper.toPrisma(category);

    const created = await this.prisma.category.create({
      data,
    });

    return PrismaCategoryMapper.toDomain(created);
  }

  async findByName(name: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { name },
    });

    if (!category) {
      return null;
    }

    return PrismaCategoryMapper.toDomain(category);
  }

  async findAll({
    page = 1,
    perPage = 10,
    search,
  }: IQueryParams = {}): Promise<IPaginatedResult<Category>> {
    const where = search
      ? {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        }
      : undefined;

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.category.count({ where }),
    ]);

    return {
      items: categories.map(PrismaCategoryMapper.toDomain),
      meta: createPaginationMeta(page, perPage, total),
    };
  }
}
