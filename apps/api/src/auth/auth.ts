import { betterAuth } from 'better-auth'
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from '../database/connection.js';
import { organization } from "better-auth/plugins"
import { admin } from "better-auth/plugins"
import { i18n, locales } from "@better-auth/i18n"

export const auth = betterAuth({
    trustedOrigins: ['http://localhost:3000'],
    advanced: {
        useSecureCookies: true,
        defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    database: drizzleAdapter(db, {
        provider: 'pg'
    }),
    plugins: [
        organization(),
        admin(),
        i18n({ translations: locales }),
    ]
})