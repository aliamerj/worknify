import {
  pgTable,
  serial,
  text,
  varchar,
  date,
  integer,
} from "drizzle-orm/pg-core";
import { project } from "./projectSchema";

export const feature = pgTable("feature", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .references(() => project.id, { onDelete: "cascade" })
    .notNull(),
  featureName: varchar("feature_name", { length: 255 }).notNull(),
  order: integer("order").notNull(),
  description: varchar("description", { length: 500 }),

  tags: text("tags"),
  startDate: date("start_date"),
  endDate: date("end_date"),
});
export type FeatureSelection = typeof feature.$inferSelect;
export type FeatureInsertion = typeof feature.$inferInsert;
