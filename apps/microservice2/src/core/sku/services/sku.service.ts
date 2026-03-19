import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SkuRepository } from '../repositories/sku.repository';
import { Sku } from '../entities/sku.entity';

@Injectable()
export class SkuService {
  constructor(
    @InjectDataSource('master') private readonly dataSource:DataSource,
        private readonly skuRepository:SkuRepository,

  ) {}

  async getById(id: number): Promise<Sku> {
    return this.skuRepository.getById(id);
  }
}
