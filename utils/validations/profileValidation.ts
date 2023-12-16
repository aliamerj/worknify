import { z } from "zod";
import validator from "validator";

const TimePeriod = z
  .object({
    startDate: z.date({
      required_error: "Start date is required",
      invalid_type_error: "Start date must be a valid date",
    }),
    endDate: z
      .date({
        required_error: "End date is required",
        invalid_type_error: "End date must be a valid date",
      })
      .optional(),
  })
  .refine((data) => data.endDate && data.endDate > data.startDate, {
    message: "End date must be after the start date",
    path: ["endDate"],
  });

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
    .max(500, "Description must be under 500 characters"),
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
  timePeriod: TimePeriod,
});

const educationSchema = z.object({
  degree: z
    .string()
    .trim()
    .min(1, "Degree cannot be empty")
    .max(30, "Degree must be under 30 characters"),
  timePeriod: TimePeriod,
  university: z
    .string()
    .trim()
    .min(1, "University name cannot be empty")
    .max(50, "University name must be under 50 characters"),
});

export const profileSchemaValidation = z.object({
  // step 1
  jobTitle: z
    .string()
    .min(5, "Job title must be at least 5 characters")
    .max(30, "Job title must be under 30 characters")
    .trim(),
  fullName: z
    .string()
    .min(5, "Full name must be at least 5 characters")
    .max(30, "Full name must be under 30 characters")
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
  // step 2
  background: z
    .string()
    .min(50, "Background must be at least 50 characters")
    .max(300, "Background must be under 300 characters")
    .trim(),
  skills: z.string().min(1, "You should select one skill at lesst"),
  experiences: z.array(experienceSchema),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  sections: z.array(sectionSchema).optional(),
  educations: z.array(educationSchema),
});
export type ProfileSchema = z.infer<typeof profileSchemaValidation>;
