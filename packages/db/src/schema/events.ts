import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, check } from "drizzle-orm/sqlite-core";
import { campaignsTable } from "./campaigns";
import { locationsTable } from "./locations";
import { threadsTable } from "./threads";

export const eventsTable = sqliteTable(
  "events",
  {
    id: text("id").primaryKey(),
    campaignId: text("campaign_id")
      .notNull()
      .references(() => campaignsTable.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    summary: text("summary"),
    description: text("description"),
    eventType: text("event_type"),
    startDayIndex: integer("start_day_index").notNull(),
    endDayIndex: integer("end_day_index"),
    temporalState: text("temporal_state", {
      enum: ["planned", "ongoing", "resolved", "cancelled"],
    }).notNull(),
    visibility: text("visibility", { enum: ["public", "dm_only"] }).notNull(),
    locationId: text("location_id").references(() => locationsTable.id),
    threadId: text("thread_id").references(() => threadsTable.id),
    parentEventId: text("parent_event_id"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    endDayAfterStartDay: check(
      "events_end_day_index_check",
      sql`${table.endDayIndex} IS NULL OR ${table.endDayIndex} >= ${table.startDayIndex}`,
    ),
    ongoingHasNoEndDay: check(
      "events_ongoing_end_day_check",
      sql`NOT (${table.temporalState} = 'ongoing' AND ${table.endDayIndex} IS NOT NULL)`,
    ),
  }),
);
