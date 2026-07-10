export type ValidationErrorByField = Record<string, string[]>;

export class ValidationErrors {
  private errors = new Map<string, string[]>();

  addError(message: string, field: string): void {
    const messages = this.errors.get(field) ?? [];

    if (!messages.includes(message)) {
      this.errors.set(field, [...messages, message]);
    }
  }

  hasErrors(): boolean {
    return this.errors.size > 0;
  }

  toJSON(): ValidationErrorByField[] {
    const errors = Array.from(this.errors.entries());

    return errors.map(([field, messages]) => ({
      [field]: messages,
    }));
  }
}
