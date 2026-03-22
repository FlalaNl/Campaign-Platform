import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { campaignsTable } from "./campaigns";
import { sessionsTable } from "./sessions";

export const daysTable = sqliteTable(
  "days",
  {
    id: text("id").primaryKey(),
    campaignId: text("campaign_id")
      .notNull()
      .references(() => campaignsTable.id, { onDelete: "cascade" }),
    dayIndex: integer("day_index").notNull(),
    displayLabel: text("display_label"),
    summary: text("summary"),
    notes: text("notes"),
    sessionId: text("session_id").references(() => sessionsTable.id),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    campaignDayUnique: uniqueIndex("idx_days_campaign_day_index_unique").on(
      table.campaignId,
      table.dayIndex,
    ),
  }),
);
