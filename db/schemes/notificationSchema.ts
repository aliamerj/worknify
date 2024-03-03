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
import { relations } from "drizzle-orm";
export const notificationTypeVaild: Readonly<[string, string, string]> = [
  "JOIN_REQUEST",
  "ACCEPT_REQUEST",
  "REJECT_REQUEST",
];
export const notificationType = pgEnum(
  "notification_type",
  notificationTypeVaild,
);

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
export const notificationsRelations = relations(notification, ({ one }) => ({
  sender: one(users, {
    fields: [notification.senderId],
    references: [users.id],
  }),
  receiver: one(users, {
    fields: [notification.receiverId],
    references: [users.id],
  }),
  project: one(project, {
    fields: [notification.projectId],
    references: [project.id],
  }),
}));
export type NotificationSelection = typeof notification.$inferSelect;
export type NotificationsInsertion = typeof notification.$inferInsert;
