import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { NotificationsService } from './notifications.service.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templateDir = path.join(__dirname, 'templates');

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: process.env.MAIL_FROM,
      },
      template: {
        dir: templateDir,
        adapter: new HandlebarsAdapter(undefined, {
          inlineCssOptions: {
            // Keep the <style> block so the responsive @media rules survive inlining.
            keepStyleTags: true,
            keepAtRules: true,
            removeInlinedSelectors: true,
            loadRemoteStylesheets: false,
            applyWidthAttributes: true,
            applyHeightAttributes: true,
          },
        }),
      },
      // Read by the adapter at render time (layout + partial registration).
      options: {
        layout: 'layout',
        partials: {
          dir: path.join(templateDir, 'partials'),
        },
      },
    }),
  ],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
