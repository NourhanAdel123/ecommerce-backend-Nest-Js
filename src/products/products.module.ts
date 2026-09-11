import { Module, forwardRef } from '@nestjs/common';
import { ProductsController } from './products.cotroller.js';
import { ProductService } from './products.service.js';
import { ReviewModule } from '../reviews/reviews.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity.js';

@Module({
  controllers: [ProductsController],
  providers: [ProductService],
  exports: [ProductService],
  imports: [TypeOrmModule.forFeature([Product])],
})
export class ProductsModule {}
