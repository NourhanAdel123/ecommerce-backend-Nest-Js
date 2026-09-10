import { Module, forwardRef } from '@nestjs/common';
import { ProductsController } from './products.cotroller.js';
import { ProductService } from './products.service.js';
import { ReviewModule } from '../reviews/reviews.module.js';

@Module({
  controllers: [ProductsController],
  providers: [ProductService],
  exports: [ProductService],
  imports: [forwardRef(() => ReviewModule)],
})
export class ProductsModule {}
