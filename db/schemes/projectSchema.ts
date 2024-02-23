import {
  date,
  integer,
  pgTable,
  serial,
  text,
  unique,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./userSchema";
export const projectTypeVaild: Readonly<[string, string, string]> = [
  "private",
  "public",
  "permission",
];
export const projectType = pgEnum("project_type", projectTypeVaild);
export const project = pgTable("project", {
  id: serial("id").primaryKey(),
  owner: text("owner_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 60 }).notNull(),
  type: projectType("project_type").notNull(),
  logo: text("logo"),
  link: varchar("project_link", { length: 255 }).notNull(),
  description: text("description").notNull(),
  projectGoal: varchar("project_goal", { length: 120 }).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  techUsed: text("tech_used").notNull(),
});

export const dev = pgTable(
  "dev",
  {
    projectId: integer("project_id")
      .references(() => project.id, { onDelete: "cascade" })
      .notNull(),
    devId: text("dev_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    joinAt: date("join_at").notNull(),
  },
  (t) => ({
    uniqueConstraint: unique().on(t.projectId, t.devId),
  }),
);
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
