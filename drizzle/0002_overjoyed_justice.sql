DO $$ BEGIN
 CREATE TYPE "projectType" AS ENUM('public', 'private', 'permission');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
