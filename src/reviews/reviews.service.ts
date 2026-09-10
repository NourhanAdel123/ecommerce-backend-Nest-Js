import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ProductService } from '../products/products.service.js';
@Injectable()
export class ReviewService {
  constructor(
    @Inject(forwardRef(() => ProductService))
    private readonly ProductService: ProductService,
  ) {}
  public getAll() {
    return [
      { id: 1, rating: 4, comment: 'good' },
      { id: 2, rating: 4, comment: 'good' },
      { id: 3, rating: 5, comment: 'excellent' },
    ];
  }
}
