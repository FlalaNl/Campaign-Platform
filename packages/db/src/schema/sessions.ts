import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { campaignsTable } from "./campaigns";

export const sessionsTable = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id")
    .notNull()
    .references(() => campaignsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  realWorldDate: text("real_world_date"),
  startDayIndex: integer("start_day_index"),
  endDayIndex: integer("end_day_index"),
});
