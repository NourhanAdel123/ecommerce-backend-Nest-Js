import { Module } from '@nestjs/common';
import { ProductsController } from './products.cotroller.js';
import { ProductService } from './products.service.js';

@Module({
  controllers: [ProductsController],
  providers: [ProductService],
})
export class ProductsModule {}
