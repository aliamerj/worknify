ALTER TABLE "star" ADD CONSTRAINT "star_user_id_profile_id_unique" UNIQUE("user_id","profile_id");--> statement-breakpoint
ALTER TABLE "dev" ADD CONSTRAINT "dev_project_id_dev_id_unique" UNIQUE("project_id","dev_id");