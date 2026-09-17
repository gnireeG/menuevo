import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { createAuth } from './auth/auth.js'
import { RestaurantsModule } from './modules/restaurants/restaurants.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { NotificationsService } from './notifications/notifications.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', '.env'],
    }),
    AuthModule.forRootAsync({
      imports: [NotificationsModule],
      inject: [NotificationsService],
      useFactory: (notificationsService: NotificationsService) => ({
        auth: createAuth(notificationsService),
      }),
    }),
    HealthModule,
    UsersModule,
    DatabaseModule,
    RestaurantsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
