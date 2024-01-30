import { z } from "zod";
import { validProjectType } from "./projectValidation";

export const joinProjectSchema = z.object({
  projectAdminId: z.string().min(5),
  projectType: z.enum(validProjectType),
});

export type JoinProjectSchema = z.infer<typeof joinProjectSchema>;
