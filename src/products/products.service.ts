import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto.js';
import { updateProductDto } from './dtos/update-product.dto.js';

type ProductType = {
  id: number;
  name: string;
  price: number;
};

@Injectable()
export class ProductService {
  private products: ProductType[] = [
    { id: 1, name: 'blouse', price: 600 },
    { id: 2, name: 'blouse', price: 700 },
    { id: 3, name: 'blouse', price: 800 },
  ];

  public creatProduct({ name, price }: CreateProductDto) {
    const newProduct: ProductType = {
      id: this.products.length + 1,
      name,
      price,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  public getAll() {
    return this.products;
  }

  public getOneBy(id: string) {
    const product = this.products.find((p) => p.id === parseInt(id));
    if (!product) throw new NotFoundException('product not found');
    return product;
  }

  public Update(id: string, updateProductDto: updateProductDto) {
    const product = this.products.find((p) => p.id === parseInt(id));
    if (!product) throw new NotFoundException('product not found');
    return { message: 'product updated successfully ' + id };
  }

  public Delete(id: string) {
    const product = this.products.find((p) => p.id === parseInt(id));
    if (!product) throw new NotFoundException('product not found');
    return { message: 'product deleted successfully ' + id };
  }
}
