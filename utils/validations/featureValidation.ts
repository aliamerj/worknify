import { z } from "zod";
const TimePeriod = z
  .object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .refine(
    (data) =>
      !(
        data.endDate &&
        data.startDate &&
        new Date(data.endDate) < new Date(data.startDate)
      ),
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
  tag: z
    .array(
      z
        .string()
        .trim()
        .refine(
          (value) => !value.includes(";"),
          "tags cannot contain the character ';'",
        )
        .refine(
          (value) => value.trim().length <= 5,
          "tag must be under 5 characters",
        ),
    )
    .max(5, "No more than 5 tags are allowed")
    .optional(),

  description: z
    .string()
    .trim()
    .max(500, "Description must be under 500 characters")
    .optional(),
  taskCount: z.number().default(0),
  order: z.number().min(0),
  timePeriod: TimePeriod,
});

export const featureDeleteSchema = z.object({
  projectId: z.number(),
  featureId: z.number(),
});

export type FeatureDeleteSchema = z.infer<typeof featureDeleteSchema>;

export type FeaureSchema = z.infer<typeof featureSchema>;
