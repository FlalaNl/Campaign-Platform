import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { campaignsTable } from "./campaigns";

export const charactersTable = sqliteTable("characters", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id")
    .notNull()
    .references(() => campaignsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  kind: text("kind", { enum: ["pc", "npc"] }).notNull(),
  status: text("status", {
    enum: ["active", "inactive", "dead", "retired", "unknown"],
  }).notNull(),
  description: text("description"),
  factionId: text("faction_id"),
  metadataJson: text("metadata_json"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
