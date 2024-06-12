CREATE TABLE IF NOT EXISTS "worksheets" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"address" text NOT NULL,
	"amount" integer NOT NULL,
	"pillars_count" integer NOT NULL,
	"beams_count" integer NOT NULL,
	"chain_pulleys" text NOT NULL
);
