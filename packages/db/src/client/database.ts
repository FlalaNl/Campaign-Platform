import initSqlJs, { type Database } from "sql.js";
import { drizzle } from "drizzle-orm/sql-js";
import * as schema from "../schema";

export type SqliteDatabaseHandle = Database;
export type CampaignPlatformDatabase = ReturnType<typeof drizzle<typeof schema>>;

export interface DatabaseClient {
  sqlite: SqliteDatabaseHandle;
  db: CampaignPlatformDatabase;
}

export const createDatabaseClient = async (): Promise<DatabaseClient> => {
  const SQL = await initSqlJs();
  const sqlite = new SQL.Database();
  sqlite.run("PRAGMA foreign_keys = ON;");

  return {
    sqlite,
    db: drizzle(sqlite, { schema }),
  };
};
