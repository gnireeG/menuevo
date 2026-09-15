import { relations } from "drizzle-orm";
import { restaurants } from "./restaurant.schema.js";
import { user } from "./auth.schema.js";
import { themes } from "./theme.schema.js";

export const restaurantsRelations = relations(restaurants, ({one, many}) => ({
    owner: one(user, {
        fields: [restaurants.owner_id],
        references: [user.id]
    }),
    theme: one(themes, {
        fields: [restaurants.theme_id],
        references: [themes.id]
    })
}))