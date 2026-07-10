import { describe, expect, test } from "vitest";

import { Entity } from "./entity";
import { UniqueEntityID } from "./unique-entity-id";

class StubEntity extends Entity<{ name: string }> {
  static create(name: string, id?: UniqueEntityID) {
    return new StubEntity({ name }, id);
  }

  private constructor(props: { name: string }, id?: UniqueEntityID) {
    super(props, id);
  }
}

describe("Entity", () => {
  describe("creation", () => {
    test("should expose id via getter", () => {
      const id = new UniqueEntityID("entity-id");
      const entity = StubEntity.create("Test", id);

      expect(entity.id).toBe(id);
    });

    test("should create with a custom id when provided", () => {
      const id = new UniqueEntityID("custom-id");
      const entity = StubEntity.create("Test", id);

      expect(entity.id.toString()).toBe("custom-id");
    });

    test("should create with a generated id when not provided", () => {
      const entity = StubEntity.create("Test");

      expect(entity.id.toString()).toEqual(expect.any(String));
      expect(entity.id.toString()).toHaveLength(36);
    });
  });

  describe("equality comparison", () => {
    test("should return true when comparing the same instance", () => {
      const entity = StubEntity.create("Test");

      expect(entity.equals(entity)).toBe(true);
    });

    test("should return true when entities share the same id reference", () => {
      const id = new UniqueEntityID("shared-id");
      const entity1 = StubEntity.create("First", id);
      const entity2 = StubEntity.create("Second", id);

      expect(entity1.equals(entity2)).toBe(true);
    });

    test("should return false when entities have different ids", () => {
      const entity1 = StubEntity.create("First", new UniqueEntityID("id-1"));
      const entity2 = StubEntity.create("Second", new UniqueEntityID("id-2"));

      expect(entity1.equals(entity2)).toBe(false);
    });

    test("should return false when entities have different id instances with the same value", () => {
      const entity1 = StubEntity.create("First", new UniqueEntityID("same-id"));
      const entity2 = StubEntity.create(
        "Second",
        new UniqueEntityID("same-id"),
      );

      expect(entity1.equals(entity2)).toBe(false);
    });
  });
});
