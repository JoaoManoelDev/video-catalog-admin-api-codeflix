import { UniqueEntityID } from "@/shared/entities/unique-entity-id";
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
      const id = new UniqueEntityID("custom-id");
      const category = makeCategory({}, id);

      expect(category.id.toString()).toBe("custom-id");
    });

    test("should create a category with a generated id when not provided", () => {
      const category = makeCategory();

      expect(category.id.toString()).toHaveLength(36);
      expect(category.id).toBeInstanceOf(UniqueEntityID);
    });

    test("should create a category without description", () => {
      const category = makeCategory({ description: undefined });

      expect(category.toJSON().description).toBeUndefined();
    });

    test("should create a category with null description", () => {
      const category = makeCategory({ description: null });

      expect(category.toJSON().description).toBeNull();
    });

    test("should add validation errors when name is empty", () => {
      const category = makeCategory({ name: "" });

      expect(category.validationErrors.hasErrors()).toBe(true);
      expect(category.validationErrors.toJSON()).toEqual(
        expect.arrayContaining([
          {
            name: [
              "name should not be empty",
              "name must be longer than or equal to 3 characters",
            ],
          },
        ]),
      );
    });

    test("should add validation errors when name is shorter than min length", () => {
      const category = makeCategory({ name: "ab" });

      expect(category.validationErrors.hasErrors()).toBe(true);
      expect(category.validationErrors.toJSON()).toEqual(
        expect.arrayContaining([
          {
            name: ["name must be longer than or equal to 3 characters"],
          },
        ]),
      );
    });

    test("should add validation errors when name exceeds max length", () => {
      const category = makeCategory({ name: "a".repeat(256) });

      expect(category.validationErrors.hasErrors()).toBe(true);
      expect(category.validationErrors.toJSON()).toEqual(
        expect.arrayContaining([
          {
            name: ["name must be shorter than or equal to 255 characters"],
          },
        ]),
      );
    });

    test("should not add validation errors when isActive is false", () => {
      const category = makeCategory({ isActive: false });

      expect(category.toJSON().isActive).toBe(false);
      expect(category.validationErrors.hasErrors()).toBe(false);
    });

    test("should not add validation errors when isActive is true", () => {
      const category = makeCategory({ isActive: true });

      expect(category.toJSON().isActive).toBe(true);
      expect(category.validationErrors.hasErrors()).toBe(false);
    });

    test("should not add validation errors for valid props", () => {
      const category = makeCategory({ name: "Movie" });

      expect(category.validationErrors.hasErrors()).toBe(false);
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

  describe("inactivate", () => {
    test("should inactivate the category", () => {
      const category = makeCategory({ isActive: true });

      category.inactivate();

      expect(category.toJSON().isActive).toBe(false);
    });
  });

  describe("validate", () => {
    test("should clear previous validation errors", () => {
      const category = makeCategory({ name: "Movie" });

      category.changeName("ab");
      category.validate();

      expect(category.validationErrors.hasErrors()).toBe(true);
      expect(category.validationErrors.toJSON()).toEqual(
        expect.arrayContaining([
          {
            name: ["name must be longer than or equal to 3 characters"],
          },
        ]),
      );

      category.changeName("Valid name");
      category.validate();

      expect(category.validationErrors.hasErrors()).toBe(false);
    });

    test("should add validation errors when name is invalid", () => {
      const category = makeCategory({ name: "Movie" });

      category.changeName("ab");
      category.validate();

      expect(category.validationErrors.hasErrors()).toBe(true);
      expect(category.validationErrors.toJSON()).toEqual(
        expect.arrayContaining([
          {
            name: ["name must be longer than or equal to 3 characters"],
          },
        ]),
      );
    });
  });

  describe("toJSON", () => {
    test("should return a serializable representation of the category", () => {
      const createdAt = new Date("2024-01-01");
      const id = new UniqueEntityID("category-id");

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
