CREATE TYPE "public"."wlan_encryption" AS ENUM('wpa', 'wep', 'nopass');--> statement-breakpoint
CREATE TABLE "themes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" json,
	"slug" text,
	"css" text,
	"is_global" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "restaurants" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "owner_id" uuid;--> statement-breakpoint
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
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_theme_id_themes_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id") ON DELETE set null ON UPDATE no action;