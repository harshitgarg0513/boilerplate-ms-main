import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { UserIdentityService } from 'apps/microservice/src/services/user-identity.service';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
    private userRepository: Repository<User>;
    constructor(
        @InjectDataSource('master') private readonly dataSource: DataSource, private readonly identityService: UserIdentityService
    ) {
        super(User, dataSource.createEntityManager());
     this.userRepository = this.dataSource.getRepository(User);
    }

    getById(id: number) {
        return this.userRepository.findOne({
            where: {
                id: id,
                company: this.identityService.getIdentity().companyId
            },
        });
    }
}
