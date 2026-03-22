import type { DatabaseClient } from "../client/database";
import type { UnitOfWork } from "@campaign-platform/application";

export class SqliteUnitOfWork implements UnitOfWork {
  public constructor(private readonly client: DatabaseClient) {}

  public async runInTransaction<T>(fn: () => Promise<T>): Promise<T> {
    this.client.sqlite.run("BEGIN");

    try {
      const result = await fn();
      this.client.sqlite.run("COMMIT");
      return result;
    } catch (error) {
      this.client.sqlite.run("ROLLBACK");
      throw error;
    }
  }
}
