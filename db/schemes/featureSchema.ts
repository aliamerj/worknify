import {
  pgTable,
  serial,
  text,
  varchar,
  date,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { project } from "./projectSchema";
import { relations } from "drizzle-orm";
import { tasks } from "./taskSchema";

export const feature = pgTable("feature", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .references(() => project.id, { onDelete: "cascade" })
    .notNull(),
  featureName: varchar("feature_name", { length: 255 }).notNull(),
  order: integer("order").notNull(),
  description: varchar("description", { length: 500 }),
  includeFeature: boolean("include_feature").default(false).notNull(),
  tags: text("tags"),
  startDate: date("start_date"),
  endDate: date("end_date"),
});
export const featuresRelations = relations(feature, ({ one, many }) => ({
  project: one(project, {
    fields: [feature.projectId],
    references: [project.id],
  }),
  tasks: many(tasks),
}));
export type FeatureSelection = typeof feature.$inferSelect;
export type FeatureInsertion = typeof feature.$inferInsert;
