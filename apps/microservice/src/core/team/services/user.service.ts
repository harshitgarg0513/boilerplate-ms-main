import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectDataSource('master') private readonly dataSource:DataSource,
        private readonly userRepsitory:UserRepository,

  ) {}

  async getById(id: number): Promise<User> {
    return this.userRepsitory.getById(id);
  }
}
