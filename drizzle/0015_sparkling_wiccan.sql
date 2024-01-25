CREATE TABLE IF NOT EXISTS "dev" (
	"project_id" integer NOT NULL,
	"dev_id" text NOT NULL,
	"join_at" date NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dev" ADD CONSTRAINT "dev_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dev" ADD CONSTRAINT "dev_dev_id_user_id_fk" FOREIGN KEY ("dev_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
