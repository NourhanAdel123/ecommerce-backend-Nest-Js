import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto.js';
import { updateProductDto } from './dtos/update-product.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly ProductRepository: Repository<Product>,
  ) {}

  public async creatProduct(dto: CreateProductDto) {
    const product = this.ProductRepository.create(dto);
    return await this.ProductRepository.save(product);
  }

  public getAll() {
    return this.ProductRepository.find();
  }

  public async getOneBy(id: string) {
    const product = await this.ProductRepository.findOneBy({ id });
    if (!product) throw new NotFoundException('product not found');
    return product;
  }

  public async Update(id: string, dto: updateProductDto) {
    const product = await this.getOneBy(id);
    product.name = dto.name ?? product.name;
    product.description = dto.description ?? product.description;
    product.price = dto.price ?? product.price;
    product.image = dto.image ?? product.image;
    return await this.ProductRepository.save(product);
  }

  public async Delete(id: string) {
    const product = await this.getOneBy(id);
    await this.ProductRepository.delete(id);
    return { message: 'product deleted successfully ' + id };
  }
}
