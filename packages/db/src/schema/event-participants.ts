import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { charactersTable } from "./characters";
import { eventsTable } from "./events";

export const eventParticipantsTable = sqliteTable("event_participants", {
  id: text("id").primaryKey(),
  eventId: text("event_id")
    .notNull()
    .references(() => eventsTable.id, { onDelete: "cascade" }),
  characterId: text("character_id")
    .notNull()
    .references(() => charactersTable.id, { onDelete: "cascade" }),
  role: text("role", {
    enum: ["participant", "subject", "instigator", "witness", "target", "mentioned"],
  }).notNull(),
  notes: text("notes"),
  isPrimary: integer("is_primary", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull(),
});
