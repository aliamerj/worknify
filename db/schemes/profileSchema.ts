import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  jobTitle: text("job_title").notNull(),
  background: text("background").notNull(),
  phoneNumber: text("phone_number").notNull(),
  address: text("address").notNull(),
  email: text("email").notNull(),
  github: text("github"),
  linkedin: text("linkedin"),
});

export const section = pgTable("section", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  profileId: integer("profile_id")
    .references(() => profile.id)
    .notNull(),
});

export type ProfileInsertion = typeof profile.$inferInsert;
