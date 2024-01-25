CREATE TABLE IF NOT EXISTS "dev" (
	"dev_id" text NOT NULL,
	"project_id" text NOT NULL,
	"join_at" date
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(60) NOT NULL,
	"type" varchar(60) NOT NULL,
	"logo" text NOT NULL,
	"project_link" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"compilation" integer DEFAULT 0 NOT NULL,
	"project_goal" varchar(120) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dev" ADD CONSTRAINT "dev_dev_id_user_id_fk" FOREIGN KEY ("dev_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dev" ADD CONSTRAINT "dev_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
