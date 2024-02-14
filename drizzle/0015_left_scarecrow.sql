DO $$ BEGIN
 CREATE TYPE "task_status_type" AS ENUM('New', 'In Progress', 'Ready to Test', 'Done');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TYPE "project_type" ADD VALUE 'private';--> statement-breakpoint
ALTER TYPE "project_type" ADD VALUE 'public';--> statement-breakpoint
ALTER TYPE "project_type" ADD VALUE 'permission';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "status" SET DATA TYPE task_status_type;