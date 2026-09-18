import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto.js';
import { updateProductDto } from './dtos/update-product.dto.js';
import { ProductService } from './products.service.js';
import { AuthRolesGuard } from '../users/guards/auth-roles.guard.js';
import { Roles } from '../users/decorators/user-role.decorator.js';
import { UserType } from '../utils/enums.js';
import { CurrentUser } from '../users/decorators/current-user.decorator.js';
import type { JWTPayloadType } from '../utils/types.js';

@Controller('/api/products')
export class ProductsController {
  constructor(private readonly ProductService: ProductService) {}

  @Post()
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  public creatProduct(
    @Body() body: CreateProductDto,
    @CurrentUser() payload: JWTPayloadType,
  ) {
    return this.ProductService.creatProduct(body, payload.id);
  }

  @Get()
  public getProducts(
    @Query('name') name: string,
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string,
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
    @Query('productPerPage', ParseIntPipe) productPerPage: number,
  ) {
    return this.ProductService.getAll(
      name,
      minPrice,
      maxPrice,
      pageNumber,
      productPerPage,
    );
  }

  @Get(':id')
  public getSingleProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.ProductService.getOneBy(id);
  }

  @Put(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  public UpdateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: updateProductDto,
  ) {
    return this.ProductService.Update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  public DeleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.ProductService.Delete(id);
  }
}
