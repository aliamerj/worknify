import { z } from "zod";

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
export const projectSchema = z.object({
  id: z.number().optional(),
  type: z.enum(["Private", "Public", "permission"]),
  devs: z.array(z.string()),
  owner: z
    .string()
    .trim()
    .min(3, "Role must be at least 3 characters")
    .max(50, "Role must be under 50 characters"),
  link: z.string().min(5).max(100),
  name: z
    .string()
    .trim()
    .min(1, "Project name cannot be empty")
    .max(50, "Project name must be under 50 characters"),
  logo: z.string().trim().min(5, "invalid image").optional(),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be under 1000 characters"),
  compilation: z.number().default(0),
  projectGoal: z
    .string()
    .trim()
    .min(50, "Project goal must be at least 50 characters")
    .max(100, "Project goal must be under 100 characters"),

  timePeriod: TimePeriod,
});

export type ProjectSchema = z.infer<typeof projectSchema>;
