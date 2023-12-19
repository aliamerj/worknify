CREATE TABLE IF NOT EXISTS "education" (
	"id" serial PRIMARY KEY NOT NULL,
	"school" varchar(60) NOT NULL,
	"degree" varchar(60) NOT NULL,
	"start_date" time NOT NULL,
	"end_date" time,
	"description" text,
	"profile_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "experience" (
	"id" serial PRIMARY KEY NOT NULL,
	"role" varchar(60) NOT NULL,
	"company" varchar(60) NOT NULL,
	"start_date" time NOT NULL,
	"end_date" time,
	"description" text,
	"profile_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "full_name" SET DATA TYPE varchar(60);--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "job_title" SET DATA TYPE varchar(60);--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "background" SET DATA TYPE varchar(400);--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "phone_number" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "address" SET DATA TYPE varchar(60);--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "github" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "linkedin" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "skills" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "education" ADD CONSTRAINT "education_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "experience" ADD CONSTRAINT "experience_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
