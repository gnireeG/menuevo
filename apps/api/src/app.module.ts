import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module.js';
import { UsersModule } from './users/users.module.js';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './auth/auth.js'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', '.env'],
    }),
    AuthModule.forRoot({auth}),
    HealthModule,
    UsersModule,
    DatabaseModule,
    // Als Nächstes: MenuModule, TranslationModule (BullMQ-Queue), PdfModule, PosModule
  ],
})
export class AppModule {}
