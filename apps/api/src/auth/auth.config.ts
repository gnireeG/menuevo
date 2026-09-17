// Entry point for the Better Auth CLI (`@better-auth/cli generate` / `migrate`).
// At runtime the instance is built by createAuth() with the real
// NotificationsService, but the CLI only inspects the adapter and plugin config,
// so a no-op stub is enough here.
import type { NotificationsService } from '../notifications/notifications.service.js';
import { createAuth } from './auth.js';

const noopNotifications = {
    async sendEmailConfirmationMail() {},
    async sendPasswordResetMail() {},
} as unknown as NotificationsService;

export const auth = createAuth(noopNotifications);
