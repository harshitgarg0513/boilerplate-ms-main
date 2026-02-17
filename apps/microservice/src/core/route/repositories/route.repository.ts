import { DataSource, Repository } from 'typeorm';
import { Route } from '../entities/route.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { UserIdentityService } from 'apps/microservice/src/services/user-identity.service';

@Injectable()
export class RouteRepository extends Repository<Route> {
    private routeRepository: Repository<Route>;
    constructor(
        @InjectDataSource('master') private readonly dataSource: DataSource, private readonly identityService: UserIdentityService
    ) {
        super(Route, dataSource.createEntityManager());
     this.routeRepository = this.dataSource.getRepository(Route);
    }

    getById(id: number) {
        return this.routeRepository.createQueryBuilder('route')
        .innerJoin('route.salesRep', 'sr')
        .where(' route.id = :id AND sr.company = :compnayId', { id: id, compnayId: this.identityService.getIdentity().companyId })
        .getOne();
    }
}
