import { Controller, Get } from '@nestjs/common';
import { ReviewService } from './reviews.service.js';
import { ProductService } from '../products/products.service.js';

@Controller()
export class ReviewsController {
  constructor(
    private readonly ReviewService: ReviewService,
    private readonly ProductService: ProductService,
  ) {}
  @Get('/api/reviews')
  public getReviews() {
    return this.ReviewService.getAll();
  }
}
