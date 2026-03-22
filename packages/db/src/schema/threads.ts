import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { campaignsTable } from "./campaigns";

export const threadsTable = sqliteTable("threads", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id")
    .notNull()
    .references(() => campaignsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
});
