import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module.js';
import { UserModule } from './users/users.module.js';
import { ReviewModule } from './reviews/reviews.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/product.entity.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Review } from './reviews/reviews.entity.js';
import { User } from './users/user.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    ProductsModule,
    UserModule,
    ReviewModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [Product, Review, User],
        synchronize: process.env.NODE_ENV !== 'production',
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./.env.${process.env.NODE_ENV}`,
    }),
  ],
})
export class AppModule {}
