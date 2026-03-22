import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { calendarsTable } from "./calendars";

export const campaignsTable = sqliteTable("campaigns", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  calendarId: text("calendar_id")
    .notNull()
    .references(() => calendarsTable.id),
  currentDayIndex: integer("current_day_index").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
