import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join, resolve } from 'path';

import { UsersModule } from './users/users.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { TransactionsModule } from './transactions/transactions.module';
import { RegisterTransactionMiddleware } from './transactions/register-transaction.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const url = configService.get<string>('DATABASE_URL');
        return {
          type: 'postgres',
          url,
          entities: [join(__dirname, '**/**.entity{.ts,.js}')],
          migrations: [join(resolve(__dirname, '..'), 'migrations/*{.ts,.js}')],
        };
      },
    }),
    UsersModule,
    RestaurantsModule,
    TransactionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RegisterTransactionMiddleware).forRoutes('users');
    consumer.apply(RegisterTransactionMiddleware).forRoutes('restaurants');
    consumer.apply(RegisterTransactionMiddleware).forRoutes('transactions');
  }
}
