ALTER TABLE "user_settings" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "user_settings" CASCADE;--> statement-breakpoint
ALTER TABLE "budgets" ALTER COLUMN "amount" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "amount" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "amount" SET DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN "createdBy" varchar NOT NULL;