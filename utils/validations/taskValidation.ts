import { statusTypeValid } from "@/db/schemes/taskSchema";
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
export const taskSchema = z.object({
  id: z.number().optional(),
  featureId: z.number(),
  name: z
    .string()
    .trim()
    .min(1, "task name must be at least 1 characters")
    .max(30, "task must be under 30 characters"),
  AssignedTo:z.string().trim().min(1).nullable(),
  description: z
    .string()
    .trim()
    .max(500, "Description must be under 500 characters")
    .optional(),
  order: z.number().min(0),
  status:z.enum(statusTypeValid),
  timePeriod: TimePeriod,
});

export const deleteTaskSchema = z.object({
  taskId: z.number(),
  featureId: z.number(),
});
export const editTaskSchema = z.object({
  id: z.number(),
  featureId: z.number(),
  name: z
    .string()
    .trim()
    .min(1, "task name must be at least 1 characters")
    .max(30, "task must be under 30 characters").optional(),

  AssignedTo:z.string().trim().min(1).optional(),
  description: z
    .string()
    .trim()
    .max(500, "Description must be under 500 characters")
    .optional(),
  order: z.number().min(0).optional(),
  status:z.enum(statusTypeValid).optional(),
  timePeriod: TimePeriod.optional(),
});
export const reorderTaskSchema = z.object({
  items: z.array(
    z.object({
      featureId: z.number(),
      order: z.number(),
    }),
  ),
  projectId: z.number(),
});
export type ReorderTaskSchema = z.infer<typeof reorderTaskSchema>;
export type EditTaskShema = z.infer<typeof editTaskSchema>;
export type DeleteTaskSchema = z.infer<typeof deleteTaskSchema>;
export type TaskSchema = z.infer<typeof taskSchema>;
