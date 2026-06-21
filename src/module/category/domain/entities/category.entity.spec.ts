import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeCategory } from "../../test/factories/make-category";

import { describe, expect, test } from "vitest";

describe("Category Entity", () => {
  describe("create", () => {
    test("should create a category with given props", () => {
      const createdAt = new Date("2024-01-01");

      const category = makeCategory({
        name: "Movie",
        description: "Movie description",
        isActive: true,
        createdAt,
      });

      expect(category.toJSON()).toEqual({
        id: category.id.toString(),
        name: "Movie",
        description: "Movie description",
        isActive: true,
        createdAt,
      });
    });

    test("should create a category with default createdAt when not provided", () => {
      const before = new Date();

      const category = makeCategory({ createdAt: undefined });
      const { createdAt } = category.toJSON();

      const after = new Date();

      expect(createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    test("should create a category with a custom id when provided", () => {
      const id = new UniqueEntityId("custom-id");
      const category = makeCategory({}, id);

      expect(category.id.toString()).toBe("custom-id");
    });

    test("should create a category with a generated id when not provided", () => {
      const category = makeCategory();

      expect(category.id.toString()).toEqual(expect.any(String));
      expect(category.id.toString()).toHaveLength(36);
    });

    test("should create a category without description", () => {
      const category = makeCategory({ description: undefined });

      expect(category.toJSON().description).toBeUndefined();
    });

    test("should create a category with null description", () => {
      const category = makeCategory({ description: null });

      expect(category.toJSON().description).toBeNull();
    });
  });

  describe("changeName", () => {
    test("should change the category name", () => {
      const category = makeCategory({ name: "Old name" });

      category.changeName("New name");

      expect(category.toJSON().name).toBe("New name");
    });
  });

  describe("changeDescription", () => {
    test("should change the category description", () => {
      const category = makeCategory({ description: "Old description" });

      category.changeDescription("New description");

      expect(category.toJSON().description).toBe("New description");
    });
  });

  describe("activate", () => {
    test("should activate the category", () => {
      const category = makeCategory({ isActive: false });

      category.activate();

      expect(category.toJSON().isActive).toBe(true);
    });
  });

  describe("deactivate", () => {
    test("should deactivate the category", () => {
      const category = makeCategory({ isActive: true });

      category.deactivate();

      expect(category.toJSON().isActive).toBe(false);
    });
  });

  describe("toJSON", () => {
    test("should return a serializable representation of the category", () => {
      const createdAt = new Date("2024-01-01");
      const id = new UniqueEntityId("category-id");

      const category = makeCategory(
        {
          name: "Movie",
          description: "Movie description",
          isActive: true,
          createdAt,
        },
        id,
      );

      expect(category.toJSON()).toEqual({
        id: "category-id",
        name: "Movie",
        description: "Movie description",
        isActive: true,
        createdAt,
      });
    });
  });
});
