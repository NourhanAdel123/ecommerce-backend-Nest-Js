import { Module, forwardRef } from '@nestjs/common';
import { ReviewsController } from './reviews.controller.js';
import { ReviewService } from './reviews.service.js';
import { ProductsModule } from '../products/products.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './reviews.entity.js';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewService],
  exports: [ReviewService],
  imports: [
    forwardRef(() => ProductsModule),
    TypeOrmModule.forFeature([Review]),
  ],
})
export class ReviewModule {}
