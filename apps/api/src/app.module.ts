import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { DatabaseModule } from './database/database.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', '.env'],
    }),
    HealthModule,
    AuthModule,
    UsersModule,
    DatabaseModule,
    // Als Nächstes: MenuModule, TranslationModule (BullMQ-Queue), PdfModule, PosModule
  ],
})
export class AppModule {}
