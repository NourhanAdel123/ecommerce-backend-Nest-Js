import { Module } from '@nestjs/common';
import { ProductsController } from './products.cotroller.js';

@Module({
  controllers: [ProductsController],
})
export class ProductsModule {}
