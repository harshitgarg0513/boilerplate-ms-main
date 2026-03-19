import { User } from './../../team/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { UserIdentityService } from 'apps/microservice2/src/services/user-identity.service';
import { Company } from '../entities/company.entity';

@Injectable()
export class CompnayRepository extends Repository<Company> {
    private companyRepository: Repository<Company>;
    constructor(
        @InjectDataSource('master') private readonly dataSource: DataSource, private readonly identityService: UserIdentityService
    ) {
        super(User, dataSource.createEntityManager());
     this.companyRepository = this.dataSource.getRepository(Company);
    }

    getById(id: number) {
        return this.companyRepository.createQueryBuilder('compnay')
        .where(' compnay.id = :id', { id: id})
        .getOne();
    }
}
