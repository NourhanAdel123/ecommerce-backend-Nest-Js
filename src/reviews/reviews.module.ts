import { Module, forwardRef } from '@nestjs/common';
import { ReviewsController } from './reviews.controller.js';
import { ReviewService } from './reviews.service.js';
import { ProductsModule } from '../products/products.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './reviews.entity.js';
import { UserModule } from '../users/users.module.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewService],
  exports: [ReviewService],
  imports: [
    TypeOrmModule.forFeature([Review]),
    UserModule,
    ProductsModule,
    JwtModule,
  ],
})
export class ReviewModule {}
