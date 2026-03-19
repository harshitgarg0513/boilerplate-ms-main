import { Inject, Injectable } from '@nestjs/common';
import { Example, ExampleRequestDto } from 'proto/beatroute/dms/example';
import { REQUEST } from '@nestjs/core';
import { UserIdentity } from 'proto/beatroute/common/user-identity';
import { User } from '../core/team/entities/user.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Company } from '../core/company/entities/company.entity';

@Injectable()
export class UserIdentityService {

  private userRepository: Repository<User>;
  constructor(@Inject(REQUEST) private request, @InjectDataSource('master') private readonly dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(User);
  }

  getIdentity(): UserIdentity {
    return this.request?.context?.identity;
  }

  getUser(): Promise<User>{
    return this.userRepository.findOne({
      where: {
        id: this.getIdentity().id,
        company: this.getIdentity().companyId
      },
    });
  }
}
