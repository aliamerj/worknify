CREATE TABLE IF NOT EXISTS "feature" (
	"id" serial PRIMARY KEY NOT NULL,
	"feature_name" varchar(255) NOT NULL,
	"description" varchar(500) NOT NULL,
	"tags" text,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL
);
