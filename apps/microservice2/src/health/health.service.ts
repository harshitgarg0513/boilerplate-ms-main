import { InjectConnection } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { Connection } from 'typeorm';
import { HealthCheckResponse } from 'proto/beatroute/dms/health';
import { InsernalServerException } from '../exceptions/internal-server.exception';

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    @InjectConnection('master')
    private masterMysql: Connection,
    @InjectConnection('slave')
    private slaveMysql: Connection,
    @InjectConnection('postgres')
    private postgres: Connection,
  ) {}
  async status(): Promise<HealthCheckResponse> {
    try {
      const healthCheckRes = await this.health.check([
        () => this.db.pingCheck('database', { connection: this.masterMysql }),
        () => this.db.pingCheck('database', { connection: this.slaveMysql }),
        () => this.db.pingCheck('database', { connection: this.postgres }),
      ]);

      if(healthCheckRes.status != 'ok') {
        throw new InsernalServerException('Database connection unhealthy!');
      }
    } catch (error) {
      throw new InsernalServerException('Unhealthy!', error);
    }

    return { status: true };
  }
}
