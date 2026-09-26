import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './reviews.service.js';
import { ProductService } from '../products/products.service.js';
import { CreateReviewDto } from './dtos/create-review.dto.js';
import type { JWTPayloadType } from '../utils/types.js';
import { AuthRolesGuard } from '../users/guards/auth-roles.guard.js';
import { Roles } from '../users/decorators/user-role.decorator.js';
import { UserType } from '../utils/enums.js';
import { CurrentUser } from '../users/decorators/current-user.decorator.js';
import { UpdateReviewDto } from './dtos/update-review.dto.js';
import { ApiSecurity } from '@nestjs/swagger';

@Controller('/api/reviews')
export class ReviewsController {
  constructor(
    private readonly ReviewService: ReviewService,
    private readonly ProductService: ProductService,
  ) {}

  @Post(':productId')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  @ApiSecurity('bearer')
  public creatReview(
    @Body() body: CreateReviewDto,
    @CurrentUser() payload: JWTPayloadType,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.ReviewService.creatReview(productId, payload.id, body);
  }

  @Get()
  public getAllReviews() {
    return this.ReviewService.getAll();
  }

  @Put(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  @ApiSecurity('bearer')
  public updateReview(
    @Body() body: UpdateReviewDto,
    @CurrentUser() payload: JWTPayloadType,
    @Param('id') id: string,
  ) {
    return this.ReviewService.updateReview(id, payload.id, body);
  }

  @Delete(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  @ApiSecurity('bearer')
  public deleteReview(
    @Param('id') id: string,
    @CurrentUser() payload: JWTPayloadType,
  ) {
    return this.ReviewService.deleteReview(id, payload);
  }
}
