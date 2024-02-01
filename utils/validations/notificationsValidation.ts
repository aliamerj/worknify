import { notificationTypeVaild } from "@/db/schemes/notificationSchema";
import { projectTypeVaild } from "@/db/schemes/projectSchema";
import { z } from "zod";

export const notificationSchema = z.object({
  senderId: z.string().min(5),
  projectType: z.enum(projectTypeVaild).optional(),
  notificationType: z.enum(notificationTypeVaild),
});

export type NotificationSchema = z.infer<typeof notificationSchema>;
