import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CompnayRepository } from '../repositories/compnay.repository';
import { Company } from '../entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectDataSource('master') private readonly dataSource:DataSource,
        private readonly compnayRepsitory:CompnayRepository,

  ) {}

  async getById(id: number): Promise<Company> {
    return this.compnayRepsitory.getById(id);
  }
}
