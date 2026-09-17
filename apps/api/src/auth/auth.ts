import { betterAuth } from 'better-auth'
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from '../database/connection.js';
import { organization } from "better-auth/plugins"
import { admin } from "better-auth/plugins"
import { i18n, locales } from "@better-auth/i18n"
import { emailOTP } from "better-auth/plugins"
import { Logger } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service.js';

const logger = new Logger('Auth');

export const createAuth = (notificationsService: NotificationsService) => betterAuth({
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
        requireEmailVerification: true,
        revokeSessionsOnPasswordReset: true
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
    },
    database: drizzleAdapter(db, {
        provider: 'pg'
    }),
    plugins: [
        organization(),
        admin(),
        i18n({ translations: locales }),
        emailOTP({
            overrideDefaultEmailVerification: true,
            disableSignUp: true,
            otpLength: 6,
            expiresIn: 60 * 10,
            allowedAttempts: 3,
            async sendVerificationOTP({email, otp, type}){
                if(type === 'email-verification'){
                    await notificationsService.sendEmailConfirmationMail({email, otp})
                } else if(type === 'forget-password'){
                    await notificationsService.sendPasswordResetMail({email, otp})
                } else {
                    // 'sign-in' (OTP login) and 'change-email' have no UI yet, but their
                    // endpoints stay reachable. Drop the request instead of throwing, so a
                    // crafted call cannot leak internals or reject in the background.
                    logger.warn(`Ignoring OTP request for unsupported type "${type}"`)
                }
            }
        })
    ]
})

export type AppAuth = ReturnType<typeof createAuth>;
