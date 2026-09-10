import { Module, forwardRef } from '@nestjs/common';
import { ReviewsController } from './reviews.controller.js';
import { ReviewService } from './reviews.service.js';
import { ProductsModule } from '../products/products.module.js';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewService],
  exports: [ReviewService],
  imports: [forwardRef(() => ProductsModule)],
})
export class ReviewModule {}
