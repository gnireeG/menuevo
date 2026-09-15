CREATE TYPE "public"."wlan_encryption" AS ENUM('wpa', 'wep', 'nopass');--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"email" text NOT NULL,
	"role" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"inviter_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo" text,
	"created_at" timestamp NOT NULL,
	"metadata" text,
	CONSTRAINT "organization_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "themes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" json,
	"slug" text,
	"css" text,
	"is_global" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "token" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "restaurants" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "active_organization_id" text;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "impersonated_by" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "banned" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "ban_reason" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "ban_expires" timestamp;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "owner_id" text;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "street" text;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "street_number" text;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "zip" text;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "country" text;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "latitude" text;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "longitude" text;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "coordinates_override" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "theme_id" uuid;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "logo" text;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "kitchen" text;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "base_locale" text;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "enabled_locales" json;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "menu_content_hash" text;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "currency" text;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "wlan_ssid" text;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "wlan_password" text;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "wlan_encryption" "wlan_encryption";--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviter_id_user_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "invitation_organizationId_idx" ON "invitation" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "invitation_email_idx" ON "invitation" USING btree ("email");--> statement-breakpoint
CREATE INDEX "member_organizationId_idx" ON "member" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "member_userId_idx" ON "member" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_theme_id_themes_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
DROP TYPE "public"."role";