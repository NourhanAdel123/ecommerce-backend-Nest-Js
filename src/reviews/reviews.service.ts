import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from '../products/products.service.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './reviews.entity.js';
import { Repository } from 'typeorm';
import { UsersService } from '../users/usres.service.js';
import { CreateReviewDto } from './dtos/create-review.dto.js';
import { UpdateReviewDto } from './dtos/update-review.dto.js';
import { ExceptionHandler } from '@nestjs/core/errors/exception-handler.js';
import { reverse } from 'dns';
import { UserType } from '../utils/enums.js';
import { JWTPayloadType } from '../utils/types.js';
@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly usersService: UsersService,
    private readonly producService: ProductService,
  ) {}

  public async creatReview(
    productId: string,
    userId: string,
    dto: CreateReviewDto,
  ) {
    const product = await this.producService.getOneBy(productId);
    const user = await this.usersService.getCurrentUser(userId);
    const review = await this.reviewRepository.create({
      ...dto,
      product,
      user,
    });
    const result = await this.reviewRepository.save(review);

    return {
      id: result.id,
      comment: result.comment,
      rating: result.rating,
      createdAt: result.createdAt,
      userId: user.id,
      productId: product.id,
    };
  }

  public async getAll() {
    return this.reviewRepository.find({ order: { createdAt: 'DESC' } });
  }

  public async updateReview(id: string, userId: string, dto: UpdateReviewDto) {
    const review = await this.getReview(id);
    if (review.user.id !== userId)
      throw new ForbiddenException('access denied , you are not allowed');
    review.rating = dto.rating ?? review.rating;
    review.comment = dto.comment ?? review.comment;
    return this.reviewRepository.save(review);
  }

  public async deleteReview(id: string, payload: JWTPayloadType) {
    const review = await this.getReview(id);
    if (review.user.id === payload.id || payload.userType === UserType.ADMIN) {
      await this.reviewRepository.remove(review);
      return { message: 'review deleted successfully' };
    }
  }

  private async getReview(id: string) {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) throw new NotFoundException('review doesnt exsist');
    return review;
  }
}
