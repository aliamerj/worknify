ALTER TABLE "feature" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "feature" ALTER COLUMN "start_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "feature" ALTER COLUMN "end_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "feature" ADD COLUMN "project_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feature" ADD CONSTRAINT "feature_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
