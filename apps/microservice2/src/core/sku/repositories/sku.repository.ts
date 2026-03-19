import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { UserIdentityService } from 'apps/microservice2/src/services/user-identity.service';
import { Sku } from '../entities/sku.entity';

@Injectable()
export class SkuRepository extends Repository<Sku> {
    private skuRepository: Repository<Sku>;
    constructor(
        @InjectDataSource('master') private readonly dataSource: DataSource, private readonly identityService: UserIdentityService
    ) {
        super(Sku, dataSource.createEntityManager());
     this.skuRepository = this.dataSource.getRepository(Sku);
    }

    getById(id: number) {
        return this.skuRepository.createQueryBuilder('sku')
        .where(' sku.id = :id AND sku.company = :compnayId', { id: id, compnayId: this.identityService.getIdentity().companyId })
        .getOne();
    }
}
