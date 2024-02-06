import { z } from "zod";
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
export const featureSchema = z.object({
  id: z.number().optional(),
  projectId: z.number(),
  featureName: z
    .string()
    .trim()
    .min(1, "Feature name must be at least 1 characters")
    .max(30, "Role must be under 30 characters"),
  tag: z.array(
    z
      .string()
      .trim()
      .min(1, "Company name cannot be empty")
      .max(60, "Company name must be under 50 characters")
      .refine((value) => !value.includes(";"), {
        message: "tags cannot contain the character ';'",
      }),
  ),
  description: z
    .string()
    .trim()
    .max(500, "Description must be under 500 characters")
    .optional(),
  taskCount: z.number().default(0),
  order: z.number().min(0),
  timePeriod: TimePeriod,
});

export type FeaureSchema = z.infer<typeof featureSchema>;
