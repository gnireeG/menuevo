import { uuid } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const restaurants = pgTable('restaurants', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name'),
    slug: text('slug').unique()
})