import { betterAuth } from 'better-auth'
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from '../database/connection.js';

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
    })
})