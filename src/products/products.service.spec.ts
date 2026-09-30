import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './products.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './product.entity.js';
import { UsersService } from '../users/usres.service.js';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: UsersService, useValue: {} },
        { provide: getRepositoryToken(Product), useValue: {} },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
  });

  it('should product service be defined', () => {
    expect(productService).toBeDefined();
  });
});
