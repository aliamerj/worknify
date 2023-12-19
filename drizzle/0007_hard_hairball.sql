ALTER TABLE "education" DROP CONSTRAINT "education_profile_id_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "experience" DROP CONSTRAINT "experience_profile_id_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "section" DROP CONSTRAINT "section_profile_id_profile_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "education" ADD CONSTRAINT "education_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "experience" ADD CONSTRAINT "experience_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "section" ADD CONSTRAINT "section_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
