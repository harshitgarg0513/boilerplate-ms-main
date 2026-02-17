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

  async getUser(): Promise<User | null> {
    const identity = this.getIdentity();
    // If no identity is available, return null instead of throwing.
    if (!identity) return Promise.resolve(null);

    // Support tokens that put the user id in `id` or `sub` and optional company fields.
    const id = (identity as any).id ?? (identity as any).sub ?? null;
    const companyId = (identity as any).companyId ?? (identity as any).company ?? null;

    if (!id) return Promise.resolve(null);

    try {
      return await this.userRepository.findOne({
        where: {
          id,
          // if companyId is null/undefined, let TypeORM handle it (no filtering by company)
          company: companyId ?? undefined,
        },
      });
    } catch (err) {
      // In local/dev environments the DB/tables may not exist. Treat DB lookup
      // failures as non-fatal and return `null` so endpoints continue to work.
      console.warn('[UserIdentityService] getUser() DB lookup failed - returning null', err && err.message ? err.message : err);
      return null;
    }
  }
}
