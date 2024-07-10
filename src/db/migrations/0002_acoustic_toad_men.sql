ALTER TABLE "session" ADD COLUMN "token" varchar;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_token_unique" UNIQUE("token");