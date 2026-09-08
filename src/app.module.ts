import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module.js';
import { UserModule } from './users/users.module.js';
import { ReviewModule } from './reviews/reviews.module.js';

@Module({
  imports: [ProductsModule, UserModule, ReviewModule],
})
export class AppModule {}
