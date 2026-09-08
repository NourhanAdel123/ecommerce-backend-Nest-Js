import { Controller, Get } from '@nestjs/common';

@Controller()
export class ReviewsController {
  @Get('/api/reviews')
  public getReviews() {
    return [
      { id: 1, rating: 4, comment: 'good' },
      { id: 2, rating: 4, comment: 'good' },
      { id: 3, rating: 5, comment: 'excellent' },
    ];
  }
}
