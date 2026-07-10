import { describe, expect, test } from "vitest";

import { ValueObject } from "./value-object";

class StubStringValueObject extends ValueObject<{ value: string }> {
  constructor(value: string) {
    super({ value });
  }
}

class StubComplexValueObject extends ValueObject<{
  count: number;
  label: string;
}> {
  constructor(count: number, label: string) {
    super({ count, label });
  }
}

class ValueObjectWithUndefinedProps extends ValueObject<{ value: string }> {
  constructor() {
    super({ value: "test" });
    (this as unknown as { props: unknown }).props = undefined;
  }
}

describe("Value Object", () => {
  describe("equality comparison", () => {
    test("should return true when value objects have the same props", () => {
      const vo1 = new StubStringValueObject("test");
      const vo2 = new StubStringValueObject("test");

      expect(vo1.equals(vo2)).toBe(true);
    });

    test("should return true when value objects have the same empty string prop", () => {
      const vo1 = new StubStringValueObject("");
      const vo2 = new StubStringValueObject("");

      expect(vo1.equals(vo2)).toBe(true);
    });

    test("should return false when value objects have different props", () => {
      const vo1 = new StubStringValueObject("test");
      const vo2 = new StubStringValueObject("other");

      expect(vo1.equals(vo2)).toBe(false);
    });

    test("should return false when comparing with null", () => {
      const vo = new StubStringValueObject("test");

      expect(vo.equals(null as unknown as ValueObject<unknown>)).toBe(false);
    });

    test("should return false when comparing with undefined", () => {
      const vo = new StubStringValueObject("test");

      expect(vo.equals(undefined as unknown as ValueObject<unknown>)).toBe(
        false,
      );
    });

    test("should return false when other value object has undefined props", () => {
      const vo = new StubStringValueObject("test");
      const otherVo = new ValueObjectWithUndefinedProps();

      expect(vo.equals(otherVo)).toBe(false);
    });

    test("should compare complex props by value", () => {
      const vo1 = new StubComplexValueObject(10, "label");
      const vo2 = new StubComplexValueObject(10, "label");
      const vo3 = new StubComplexValueObject(20, "other");

      expect(vo1.equals(vo2)).toBe(true);
      expect(vo1.equals(vo3)).toBe(false);
    });
  });
});
