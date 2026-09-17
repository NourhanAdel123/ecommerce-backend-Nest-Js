import { Module, forwardRef } from '@nestjs/common';
import { ProductsController } from './products.cotroller.js';
import { ProductService } from './products.service.js';
import { ReviewModule } from '../reviews/reviews.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity.js';
import { UserModule } from '../users/users.module.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ProductsController],
  providers: [ProductService],
  exports: [ProductService],
  imports: [TypeOrmModule.forFeature([Product]), UserModule, JwtModule],
})
export class ProductsModule {}
