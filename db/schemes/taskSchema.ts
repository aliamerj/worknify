import {
  pgTable,
  serial,
  varchar,
  date,
  integer,
  pgEnum,
  text,
} from "drizzle-orm/pg-core";
import { feature } from "./featureSchema";
import { users } from "./userSchema";

export const statusTypeValid = ["New", "In Progress", "Ready to Test", "Done"] as const;
export type ColumnId = typeof statusTypeValid[number];

export const statusType = pgEnum("task_status_type", statusTypeValid);
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  AssignedTo:text("assigned_to").references(()=>users.id,{onDelete: 'set null'}),
  featureId: integer("feature_id")
    .references(() => feature.id, { onDelete: "cascade" })
    .notNull(),
  status: statusType("status").notNull(),
  name: varchar("feature_name", { length: 255 }).notNull(),
  order: integer("order").notNull(),
  description: varchar("description", { length: 500 }),
  startDate: date("start_date"),
  endDate: date("end_date"),
});
export type TaskSelection = typeof tasks.$inferSelect;
export type TaskInsertion = typeof tasks.$inferInsert;
