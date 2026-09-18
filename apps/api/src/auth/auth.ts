import { betterAuth } from 'better-auth'
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from '../database/connection.js';
import { organization } from "better-auth/plugins"
import { admin } from "better-auth/plugins"
import { i18n, locales } from "@better-auth/i18n"
import { emailOTP } from "better-auth/plugins"
import { Logger } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service.js';
import { passkey } from "@better-auth/passkey"
import { createAuthMiddleware } from "better-auth/api"

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
    user: {
        additionalFields: {
            activeOrganizationId: {
                type: 'string',
                required: false,
                input: false,
                fieldName: 'active_organization_id',
                returned: false
            }
        }
    },
    plugins: [
        organization({
            async sendInvitationEmail(data, request) {
                // Without the origin the link in the mail would point at
                // "undefined/accept-invitation?id=..." - an invitation nobody can
                // act on. Sending nothing is the honest outcome, so the invitation
                // can be resent once the environment is configured.
                const webOrigin = process.env.WEB_ORIGIN
                if (!webOrigin) {
                    logger.error('WEB_ORIGIN is not set - no invitation mail was sent')
                    return
                }

                const inviteLink = webOrigin + '/accept-invitation?id=' + data.id;
                await notificationsService.sendOrganizationInviteMail({url: inviteLink, email: data.email, inviterName: data.inviter.user.name})
            },
        }),
        admin(),
        i18n({ translations: locales }),
        passkey(),
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
    ],
    hooks: {
        // `get-invitation` only returns the inviter's *email*. The accept page
        // wants to greet people with a name, so the inviter is looked up once
        // and merged into the response. Every auth check the endpoint does
        // (session, recipient match, expiry) has already passed at this point.
        after: createAuthMiddleware(async (ctx) => {
            if (ctx.path !== '/organization/get-invitation') return

            const invitation = ctx.context.returned
            if (!invitation || typeof invitation !== 'object' || !('inviterId' in invitation)) return

            // Decoration only: the invitation itself is already complete, so a
            // failing lookup must not turn a valid answer into a 500. The page
            // falls back to the inviter's email when the name is missing.
            const inviter = await ctx.context.adapter
                .findOne<{ name: string }>({
                    model: 'user',
                    where: [{ field: 'id', value: (invitation as { inviterId: string }).inviterId }],
                })
                .catch((error: unknown) => {
                    logger.warn(`Could not load the inviter for invitation lookup: ${error}`)
                    return null
                })

            return ctx.json({ ...invitation, inviterName: inviter?.name ?? null })
        })
    },
    databaseHooks: {
        session: {
            create: {
                // set last active organization on login
                before: async(session, ctx) => {
                    const adapter = ctx!.context.adapter;

                    const user = await adapter.findOne<{ activeOrganizationId: string | null }>({
                        model: "user",
                        where: [{ field: "id", value: session.userId }],
                    });

                    let orgId = user?.activeOrganizationId ?? null

                    if(orgId){
                        const member = await adapter.findOne({
                            model: 'member',
                            where: [
                                { field: 'userId', value: session.userId},
                                { field: 'organizationId', value: orgId}
                            ]
                        })

                        if(!member) orgId = null;
                    }

                    if (!orgId) {
                        const member = await adapter.findOne<{ organizationId: string }>({
                            model: "member",
                            where: [{ field: "userId", value: session.userId }],
                        });
                        orgId = member?.organizationId ?? null;
                    }

                    return { data: { ...session, activeOrganizationId: orgId } };
                }
            },
            update: {
                before: async (data, ctx) => {
                if (!("activeOrganizationId" in data)) return { data };

                const userId =
                    (data as any).userId ?? ctx?.context.session?.session.userId;
                if (!userId) return { data };

                await ctx!.context.adapter.update({
                    model: "user",
                    where: [{ field: "id", value: userId }],
                    update: { activeOrganizationId: data.activeOrganizationId ?? null },
                });

                return { data };
                },
            }
        }
    }
})

export type AppAuth = ReturnType<typeof createAuth>;
