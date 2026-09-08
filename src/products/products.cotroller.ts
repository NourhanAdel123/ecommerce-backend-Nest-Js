import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto.js';
import { updateProductDto } from './dtos/update-product.dto.js';
import type { Request, Response } from 'express';
type ProductType = {
  id: number;
  name: string;
  price: number;
};
@Controller('/api/products')
export class ProductsController {
  private products: ProductType[] = [
    { id: 1, name: 'blouse', price: 600 },
    { id: 2, name: 'blouse', price: 700 },
    { id: 3, name: 'blouse', price: 800 },
  ];

  @Post('/express-way')
  public creatProductExpress(@Req() req: Request, @Res() res: Response) {
    const newProduct: ProductType = {
      id: this.products.length + 1,
      name: req.body.name,
      price: req.body.price,
    };
    this.products.push(newProduct);
    res.status(201).json(newProduct);
  }

  @Post()
  public creatProduct(@Body() body: CreateProductDto) {
    const newProduct: ProductType = {
      id: this.products.length + 1,
      name: body.name,
      price: body.price,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  @Get()
  public getProducts() {
    return this.products;
  }

  @Get(':id')
  public getSingleProduct(@Param('id') id: string) {
    const product = this.products.find((p) => p.id === parseInt(id));
    if (!product) throw new NotFoundException('product not found');
    return product;
  }

  @Put(':id')
  public UpdateProduct(
    @Param('id') id: string,
    @Body() body: updateProductDto,
  ) {
    const product = this.products.find((p) => p.id === parseInt(id));
    if (!product) throw new NotFoundException('product not found');
    return { message: 'product updated successfully ' + id };
  }

  @Delete(':id')
  public DeleteProduct(@Param('id') id: string) {
    const product = this.products.find((p) => p.id === parseInt(id));
    if (!product) throw new NotFoundException('product not found');
    return { message: 'product deleted successfully ' + id };
  }
}
