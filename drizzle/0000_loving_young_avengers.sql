CREATE TABLE "budgets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"amount" integer NOT NULL,
	"icon" varchar,
	"color" varchar NOT NULL,
	"createdBy" varchar NOT NULL,
	"createdAt" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"amount" integer DEFAULT 0 NOT NULL,
	"budgetId" integer,
	"createdAt" varchar NOT NULL,
	"category" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_budgetId_budgets_id_fk" FOREIGN KEY ("budgetId") REFERENCES "public"."budgets"("id") ON DELETE no action ON UPDATE no action;