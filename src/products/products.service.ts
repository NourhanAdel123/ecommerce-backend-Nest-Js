import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto.js';
import { updateProductDto } from './dtos/update-product.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity.js';
import { Between, Like, Repository } from 'typeorm';
import { UsersService } from '../users/usres.service.js';
import { dot } from 'node:test/reporters';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly ProductRepository: Repository<Product>,
    private readonly userService: UsersService,
  ) {}

  public async creatProduct(dto: CreateProductDto, id: string) {
    const user = await this.userService.getCurrentUser(id);
    const product = this.ProductRepository.create({
      ...dto,
      name: dto.name.toLowerCase(),
      user,
    });
    return this.ProductRepository.save(product);
  }

  public getAll(name?: string, minPrice?: string, maxPrice?: string) {
    const filters = {
      ...(name ? { name: Like(`%${name.toLowerCase()}%`) } : {}),
      ...(minPrice && maxPrice
        ? { price: Between(parseInt(minPrice), parseInt(maxPrice)) }
        : {}),
    };
    return this.ProductRepository.find({ where: filters });
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
