import {
  date,
  integer,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./userSchema";

export const project = pgTable("project", {
  id: serial("id").primaryKey(),
  owner: text("owner_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 60 }).notNull(),
  type: varchar("type", { length: 60 }).notNull(),
  logo: text("logo").notNull(),
  link: varchar("project_link", { length: 255 }).notNull(),
  description: text("description").notNull(),
  compilation: integer("compilation").default(0).notNull(),
  projectGoal: varchar("project_goal", { length: 120 }).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
});

export const dev = pgTable("dev", {
  projectId: integer("project_id")
    .references(() => project.id, { onDelete: "cascade" })
    .notNull(),
  devId: text("dev_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  joinAt: date("join_at").notNull(),
});
export const starProject = pgTable("star_project", {
  projectId: integer("project_id")
    .references(() => project.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
});

// star
export type StarProjectSelection = typeof starProject.$inferSelect;
export type StarProjectInsertion = typeof starProject.$inferInsert;
// project
export type ProjectSelection = typeof project.$inferSelect;
export type ProjectInsertion = typeof project.$inferInsert;
// dev
export type DevSelection = typeof dev.$inferSelect;
export type DevInsertion = typeof dev.$inferInsert;
