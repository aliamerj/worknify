DO $$ BEGIN
 CREATE TYPE "project_type" AS ENUM('public', 'private', 'permission');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "project_type" SET DATA TYPE project_type;