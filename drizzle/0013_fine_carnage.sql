ALTER TYPE "project_type" ADD VALUE 'New';--> statement-breakpoint
ALTER TYPE "project_type" ADD VALUE 'In Progress';--> statement-breakpoint
ALTER TYPE "project_type" ADD VALUE 'Ready to Test';--> statement-breakpoint
ALTER TYPE "project_type" ADD VALUE 'Done';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"feature_id" integer NOT NULL,
	"status" "project_type" NOT NULL,
	"feature_name" varchar(255) NOT NULL,
	"order" integer NOT NULL,
	"description" varchar(500),
	"start_date" date,
	"end_date" date
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_feature_id_feature_id_fk" FOREIGN KEY ("feature_id") REFERENCES "feature"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
