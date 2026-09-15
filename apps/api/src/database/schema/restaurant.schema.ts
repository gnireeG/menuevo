import { boolean, json, pgEnum, uuid } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { themes } from "./theme.schema.js";
import { user } from "./auth.schema.js";

export const wlanEncryptionEnum = pgEnum('wlan_encryption', ['wpa', 'wep', 'nopass']);

export const restaurants = pgTable('restaurants', {
    id: uuid('id').primaryKey().defaultRandom(),
    owner_id: uuid('owner_id').references(() => user.id, {onDelete: 'set null'}),
    name: text('name').notNull(),
    slug: text('slug').unique(),
    street: text('street'),
    street_number: text('street_number'),
    zip: text('zip'),
    city: text('city'),
    country: text('country'),
    latitude: text('latitude'),
    longitude: text('longitude'),
    coordinates_override: boolean('coordinates_override').default(false),
    theme_id: uuid('theme_id').references(() => themes.id, {onDelete: 'set null'}),
    logo: text('logo'),
    kitchen: text('kitchen'),
    description: text('description'),
    base_locale: text('base_locale'),
    enabled_locales: json('enabled_locales'),
    menu_content_hash: text('menu_content_hash'),
    currency: text('currency'),
    wlan_ssid: text('wlan_ssid'),
    wlan_password: text('wlan_password'),
    wlan_encryption: wlanEncryptionEnum(),
})