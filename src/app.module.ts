import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { MessagesModule } from './messages/messages.module';
import { UsersModule } from './users/users.module';
import { ChoiceModule } from './choice/choice.module';
import { GameRoundModule } from './gameRound/game_round.module';
// import { OptionModule } from './options/option.module';
import { SequelizeModule } from '@nestjs/sequelize';

import { GameModule } from './game/game.module';
import { GuessModule } from './guess/guess.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { ScoreModule } from './score/score.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { HttpCacheInterceptor } from './common/http-cache.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: parseInt(configService.get<string>('RATE_LIMIT_TTL', '60'), 10),
            limit: parseInt(
              configService.get<string>('RATE_LIMIT_MAX', '100'),
              10,
            ),
          },
        ],
      }),
    }),
    UsersModule,
    ChoiceModule,
    GameRoundModule,
    // OptionModule,
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction =
          configService.get<string>('NODE_ENV') === 'production';
        const host = configService.get<string>('HOST');
        return {
          dialect: 'postgres',
          host,
          port: parseInt(configService.get<string>('DB_PORT')) || 5432,
          username: configService.get<string>('DATABASE_USER'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE'),
          synchronize: !isProduction,
          autoLoadModels: true,
          models: [__dirname + '/**/models/*.model.ts'],
          dialectOptions:
            isProduction || (host && host.includes('neon.tech'))
              ? {
                ssl: {
                  require: true,
                  rejectUnauthorized: false,
                },
              }
              : undefined,
        };
      },
    }),

    GameModule,

    GuessModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        isGlobal: true,
        ttl: parseInt(configService.get<string>('CACHE_TTL', '30'), 10),
        max: parseInt(configService.get<string>('CACHE_MAX', '100'), 10),
      }),
    }),
    ScoreModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
  ],
})
export class AppModule { }
