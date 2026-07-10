import { describe, expect, test } from "vitest";

import { UniqueEntityID } from "./unique-entity-id";

describe("Unique Entity ID", () => {
  describe("creation", () => {
    test("should create with a custom id when provided", () => {
      const id = new UniqueEntityID("custom-id");

      expect(id.toValue()).toBe("custom-id");
      expect(id.toString()).toBe("custom-id");
    });

    test("should generate a uuid when id is not provided", () => {
      const id = new UniqueEntityID();

      expect(id.toValue()).toEqual(expect.any(String));
      expect(id.toString()).toHaveLength(36);
    });
  });

  describe("serialization", () => {
    test("should return the value via toValue", () => {
      const id = new UniqueEntityID("entity-id");

      expect(id.toValue()).toBe("entity-id");
    });

    test("should return the value as string via toString", () => {
      const id = new UniqueEntityID("entity-id");

      expect(id.toString()).toBe("entity-id");
    });
  });
});
