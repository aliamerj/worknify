import {
  date,
  integer,
  pgTable,
  serial,
  text,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./userSchema";
import { relations } from "drizzle-orm";

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
    .references(() => profile.id, { onDelete: "cascade" })
    .notNull(),
});

export const profileStar = pgTable(
  "profile_star",
  {
    profileId: integer("profile_id")
      .references(() => profile.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => ({
    uniqueConstraint: unique().on(t.userId, t.profileId),
  }),
);

export const experience = pgTable("experience", {
  id: serial("id").primaryKey(),
  company: varchar("company", { length: 60 }).notNull(),
  role: varchar("role", { length: 60 }).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  description: text("description"),
  profileId: integer("profile_id")
    .references(() => profile.id, { onDelete: "cascade" })
    .notNull(),
});
export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  school: varchar("school", { length: 60 }).notNull(),
  degree: varchar("degree", { length: 60 }).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  description: text("description"),
  profileId: integer("profile_id")
    .references(() => profile.id, { onDelete: "cascade" })
    .notNull(),
});
export const profileRelations = relations(profile, ({ many }) => ({
  experiences: many(experience),
  educations: many(education),
  sections: many(section),
  stars: many(profileStar, {
    relationName: "profile_star",
  }),
}));
export const experienceRelations = relations(experience, ({ one }) => ({
  profile: one(profile, {
    fields: [experience.profileId],
    references: [profile.id],
  }),
}));
export const educationsRelations = relations(education, ({ one }) => ({
  profile: one(profile, {
    fields: [education.profileId],
    references: [profile.id],
  }),
}));
export const sectionsRelations = relations(section, ({ one }) => ({
  profile: one(profile, {
    fields: [section.profileId],
    references: [profile.id],
  }),
}));

export const starsRelations = relations(profileStar, ({ one }) => ({
  profile: one(profile, {
    fields: [profileStar.profileId],
    references: [profile.id],
    relationName: "profile_star",
  }),
}));

export type ProfileInsertion = typeof profile.$inferInsert;
export type SectionInsertion = typeof section.$inferInsert;
export type EducationInsertion = typeof education.$inferInsert;
export type ExperienceInsertion = typeof experience.$inferInsert;

//selection
export type ProfileSelection = typeof profile.$inferSelect;
export type SectionSelection = typeof section.$inferSelect;
export type EducationSelection = typeof education.$inferSelect;
export type ExperienceSelection = typeof experience.$inferSelect;
export type StarSelection = typeof profileStar.$inferSelect;
