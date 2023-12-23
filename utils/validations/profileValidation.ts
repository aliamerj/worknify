import { z } from "zod";
import validator from "validator";

const TimePeriod = z
  .object({
    startDate: z.string({
      required_error: "Start date is required",
    }),
    endDate: z
      .string({
        required_error: "End date is required",
      })
      .nullable(),
  })
  .refine(
    (data) =>
      !(data.endDate && new Date(data.endDate) < new Date(data.startDate)),
    {
      message: "End date must be after the start date",
      path: ["endDate"],
    },
  );

const sectionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .max(50, "Title must be under 50 characters"),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(700, "Description must be under 700 characters"),
});

export const experienceSchema = z.object({
  role: z
    .string()
    .trim()
    .min(3, "Role must be at least 3 characters")
    .max(50, "Role must be under 50 characters"),
  company: z
    .string()
    .trim()
    .min(1, "Company name cannot be empty")
    .max(50, "Company name must be under 50 characters"),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(700, "Description must be under 700 characters")
    .optional(),
  timePeriod: TimePeriod,
});

const educationSchema = z.object({
  degree: z
    .string()
    .trim()
    .min(1, "Degree cannot be empty")
    .max(50, "Degree must be under 30 characters"),
  timePeriod: TimePeriod,
  school: z
    .string()
    .trim()
    .min(1, "University name cannot be empty")
    .max(50, "University name must be under 50 characters"),
});

export const profileSchemaValidation = z.object({
  jobTitle: z
    .string()
    .min(5, "Job title must be at least 5 characters")
    .max(50, "Job title must be under 30 characters")
    .trim(),
  fullName: z
    .string()
    .min(5, "Full name must be at least 5 characters")
    .max(50, "Full name must be under 30 characters")
    .trim(),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(50, "Address must be under 50 characters")
    .trim(),
  email: z
    .string()
    .email("Invalid email address")
    .min(5, "Email cannot be empty"),
  phoneNumber: z
    .string()
    .refine(validator.isMobilePhone, "Invalid phone number"),
  background: z
    .string()
    .min(50, "Background must be at least 50 characters")
    .max(300, "Background must be under 300 characters")
    .trim(),
  skills: z.string().min(1, "You should select one skill at lesst"),
  experiences: z.array(experienceSchema),
  github: z.string().max(200).optional(),
  linkedin: z.string().max(200).optional(),
  sections: z.array(sectionSchema),
  educations: z.array(educationSchema),
});

export const editProfileSchemaValidation = z.object({
  profileId: z.number(),
  jobTitle: z.string().min(5).max(50).trim().optional(),
  fullName: z.string().min(5).max(50).trim().optional(),
  address: z.string().min(5).max(50).trim().optional(),
  email: z.string().email().min(5).optional(),
  phoneNumber: z
    .string()
    .refine(validator.isMobilePhone, "Invalid phone number")
    .optional(),
  background: z.string().min(50).max(300).trim().optional(),
  skills: z.string().min(1).optional(),
  experiences: z.array(experienceSchema).optional(),
  github: z.string().max(200).optional(),
  linkedin: z.string().max(200).optional(),
  sections: z.array(sectionSchema).optional(),
  educations: z.array(educationSchema).optional(),
});

export type ProfileSchema = z.infer<typeof profileSchemaValidation>;
export type ExperienceSchema = z.infer<typeof experienceSchema>;
export type EducationSchema = z.infer<typeof educationSchema>;
export type SectionSchema = z.infer<typeof sectionSchema>;
