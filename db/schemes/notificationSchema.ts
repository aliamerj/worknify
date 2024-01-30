import {
  pgTable,
  serial,
  pgEnum,
  text,
  integer,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./userSchema";
import { project } from "./projectSchema";

export const notificationType = pgEnum("notification_type", ["JOIN_REQUEST"]);

export const notification = pgTable(
  "notification",
  {
    id: serial("id").primaryKey(),
    senderId: text("sender_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    receiverId: text("receiver_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    notificationType: notificationType("notification_type").notNull(),
    projectId: integer("project_id")
      .references(() => project.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => ({
    uniqueConstraint: unique().on(
      t.projectId,
      t.receiverId,
      t.senderId,
      t.notificationType,
    ),
  }),
);
