ALTER TABLE "user" DROP CONSTRAINT "user_profile_id_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "profile_id";--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_unique" UNIQUE("user_id");