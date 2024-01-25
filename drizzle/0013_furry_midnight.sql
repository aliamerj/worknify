ALTER TABLE "dev" ALTER COLUMN "project_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "dev" ADD COLUMN "join_at" date NOT NULL;