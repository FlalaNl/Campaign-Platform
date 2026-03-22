export class ValidationError extends Error {
  public readonly issues: string[];

  public constructor(message: string, issues: string[] = []) {
    super(message);
    this.name = "ValidationError";
    this.issues = issues;
  }
}

export class NotFoundError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export class ImportError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "ImportError";
  }
}
