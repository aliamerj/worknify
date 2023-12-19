import {
  date,
  integer,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";

export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 60 }).notNull(),
  jobTitle: varchar("job_title", { length: 60 }).notNull(),
  background: varchar("background", { length: 400 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 100 }).notNull(),
  address: varchar("address", { length: 60 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  github: varchar("github", { length: 100 }),
  linkedin: varchar("linkedin", { length: 100 }),
  skills: text("skills"),
});

export const section = pgTable("section", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  profileId: integer("profile_id")
    .references(() => profile.id)
    .notNull(),
});

export const experience = pgTable("experience", {
  id: serial("id").primaryKey(),
  role: varchar("role", { length: 60 }).notNull(),
  startDate: date("start_date").notNull(),
  endData: date("end_date"),
  description: text("description"),
  profileId: integer("profile_id")
    .references(() => profile.id)
    .notNull(),
});
export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  school: varchar("school", { length: 60 }).notNull(),
  degree: varchar("degree", { length: 60 }).notNull(),
  startDate: date("start_date").notNull(),
  endData: date("end_date"),
  description: text("description"),
  profileId: integer("profile_id")
    .references(() => profile.id)
    .notNull(),
});

export type ProfileInsertion = typeof profile.$inferInsert;
export type SectionInsertion = typeof section.$inferInsert;
export type EducationInsertion = typeof education.$inferInsert;
export type ExperienceInsertion = typeof experience.$inferInsert;
