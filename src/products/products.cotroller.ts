import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto.js';
import { updateProductDto } from './dtos/update-product.dto.js';
import { ProductService } from './products.service.js';

@Controller('/api/products')
export class ProductsController {
  constructor(private readonly ProductService: ProductService) {}

  @Post()
  public creatProduct(@Body() body: CreateProductDto) {
    return this.ProductService.creatProduct(body);
  }

  @Get()
  public getProducts() {
    return this.ProductService.getAll();
  }

  @Get(':id')
  public getSingleProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.ProductService.getOneBy(id);
  }

  @Put(':id')
  public UpdateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: updateProductDto,
  ) {
    return this.ProductService.Update(id, body);
  }

  @Delete(':id')
  public DeleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.ProductService.Delete(id);
  }
}
