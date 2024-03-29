import { z } from "zod";
import { MB } from "../constants";
import { projectTypeVaild } from "@/db/schemes/projectSchema";

const TimePeriod = z
  .object({
    startDate: z.string({
      required_error: "Start date is required",
    }),
    endDate: z.string({
      required_error: "End date is required",
    }),
  })
  .refine(
    (data) =>
      !(data.endDate && new Date(data.endDate) < new Date(data.startDate)),
    {
      message: "End date must be after the start date",
      path: ["endDate"],
    },
  );
export const projectSchema = z.object({
  id: z.number().optional(),
  type: z.enum(projectTypeVaild),
  link: z.string().min(1).max(100),
  name: z
    .string()
    .trim()
    .min(1, "Project name cannot be empty")
    .max(50, "Project name must be under 50 characters"),
  logo: z
    .any()
    .refine(
      (file) => {
        return (
          file ||
          (file instanceof File && file.type.substring(0, 5) === "image")
        );
      },
      {
        message: "Invalid image",
      },
    )
    .refine((file) => file || (file instanceof File && file.size < MB), {
      message: "image is too large. Maximum size is 1 MB",
    })
    .optional(),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must be under 5000 characters"),
  compilation: z.number().default(0),
  projectGoal: z
    .string()
    .trim()
    .min(50, "Project goal must be at least 50 characters")
    .max(100, "Project goal must be under 100 characters"),
  techUsed: z.string().min(1, "You should select one tech at lesst"),

  timePeriod: TimePeriod,
});

export const updateProjectSchema = z.object({
  id: z.number(),
  type: z.enum(projectTypeVaild).optional(),
  link: z.string().min(1).max(100).optional(),
  name: z
    .string()
    .trim()
    .min(1, "Project name cannot be empty")
    .max(50, "Project name must be under 50 characters")
    .optional(),
  logo: z
    .any()
    .refine(
      (file) => {
        return file instanceof File && file.type.substring(0, 5) === "image";
      },
      {
        message: "Invalid image",
      },
    )
    .refine((file) => file instanceof File && file.size < MB, {
      message: "image is too large. Maximum size is 1 MB",
    })
    .optional(),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must be under 5000 characters")
    .optional(),
  compilation: z.number().optional(),
  projectGoal: z
    .string()
    .trim()
    .min(50, "Project goal must be at least 50 characters")
    .max(100, "Project goal must be under 100 characters")
    .optional(),
  techUsed: z.string().min(1, "You should select one tech at lesst").optional(),

  timePeriod: TimePeriod.optional(),
});

export type ProjectSchema = z.infer<typeof projectSchema>;
export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;
