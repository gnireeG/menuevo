import { boolean, json, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const themes = pgTable('themes', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: json('name'),
    slug: text('slug'),
    css: text('css'),
    is_global: boolean('is_global').default(false)
})