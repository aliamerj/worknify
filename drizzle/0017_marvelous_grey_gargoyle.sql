CREATE TABLE IF NOT EXISTS "star_project" (
	"project_id" integer NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "star_project" ADD CONSTRAINT "star_project_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "star_project" ADD CONSTRAINT "star_project_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
