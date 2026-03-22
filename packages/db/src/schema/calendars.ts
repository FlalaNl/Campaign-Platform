import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const calendarsTable = sqliteTable("calendars", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type", {
    enum: ["custom", "gregorian", "forgotten_realms"],
  }).notNull(),
  configJson: text("config_json").notNull().default("{}"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
