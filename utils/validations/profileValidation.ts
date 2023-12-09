import { z } from "zod";
import validator from "validator";

const sectionSchema = z.object({
  title: z.string().trim().min(1).max(50),
  description: z.string().trim().min(5),
});

export const profileSchemaValidation = z.object({
  jobTitle: z.string().min(5).max(30).trim(),
  fullName: z.string().min(5).max(30).trim(),
  background: z.string().min(50).max(300).trim(),
  phoneNumber: z.string().refine(validator.isMobilePhone),
  address: z.string().min(5).max(30).trim(),
  email: z.string().min(1).email(),
  github: z.string().trim().optional(),
  linkedin: z.string().trim().optional(),
  sections: z.array(sectionSchema).optional(),
});

export type ProfileSchema = z.infer<typeof profileSchemaValidation>;
