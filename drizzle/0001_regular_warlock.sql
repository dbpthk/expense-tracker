CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"icon" varchar NOT NULL,
	"color" varchar NOT NULL,
	"isDefault" integer DEFAULT 0 NOT NULL,
	"createdBy" varchar NOT NULL,
	"createdAt" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar NOT NULL,
	"currency" varchar DEFAULT 'AUD',
	"createdAt" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "budgets" ADD COLUMN "timePeriod" varchar DEFAULT 'monthly';--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN "color" varchar NOT NULL;