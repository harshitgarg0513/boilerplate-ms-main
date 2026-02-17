import { Injectable } from '@nestjs/common';
import { RouteRepository } from '../repositories/route.repository';
import { Route } from '../entities/route.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class RouteService {
  constructor(
    @InjectDataSource('master') private readonly dataSource:DataSource,
        private readonly routeRepository:RouteRepository,

  ) {}

  async getRouteById(id: number): Promise<Route> {
    return this.routeRepository.getById(id);
  }
}
