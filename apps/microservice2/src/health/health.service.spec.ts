import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';
import { HealthCheckService, TerminusModule, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { Connection } from 'mysql2/typings/mysql/lib/Connection';
import { HealthCheckExecutor } from '@nestjs/terminus/dist/health-check/health-check-executor.service';
import { InsernalServerException } from '../exceptions/internal-server.exception';

describe('HealthService', () => {
  let service: HealthService;
  let healthCheckService: HealthCheckService;
  let db: TypeOrmHealthIndicator;
  let masterMysql: Connection;
  let slaveMysql: Connection;
  let postgres: Connection;

  beforeEach(async () => {
    db = {
      pingCheck: jest.fn().mockResolvedValue({ status: 'up' }),
    } as unknown as TypeOrmHealthIndicator;

    masterMysql = {
    } as unknown as Connection;

    slaveMysql = {
    } as unknown as Connection;

    postgres = {
    } as unknown as Connection;

    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      providers: [
        HealthService,
        { provide: TypeOrmHealthIndicator, useValue: db },
        { provide: 'masterDataSource', useValue: masterMysql },
        { provide: 'slaveDataSource', useValue: slaveMysql },
        { provide: 'postgresDataSource', useValue: postgres },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
    db = await module.resolve<TypeOrmHealthIndicator>(TypeOrmHealthIndicator);
    masterMysql = module.get<Connection>('masterDataSource');
    slaveMysql = module.get<Connection>('slaveDataSource');
    postgres = module.get<Connection>('postgresDataSource');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call health.check with correct arguments', async () => {
    const healthCheckSpy = jest.spyOn(healthCheckService, 'check');
    await service.status();
    expect(healthCheckSpy).toHaveBeenCalledTimes(1);
    const calls = healthCheckSpy.mock.calls[0][0];

    expect(calls).toHaveLength(3);

    expect(calls[0]).toBeInstanceOf(Function);
    expect(calls[1]).toBeInstanceOf(Function);
    expect(calls[2]).toBeInstanceOf(Function);

    const masterCheck = calls[0]();
    const slaveCheck = calls[1]();
    const postgresCheck = calls[2]();

    expect(masterCheck).resolves.toEqual({ status: 'up' });
    expect(slaveCheck).resolves.toEqual({ status: 'up' });
    expect(postgresCheck).resolves.toEqual({ status: 'up' });
  });

  it('should return HealthCheckResponse with status true', async () => {
    const result = await service.status();
    expect(result).toHaveProperty('status', true);
  });

  it('should throw InsernalServerException exception on HealthCheckService error', async () => {
    jest.spyOn(healthCheckService, 'check').mockImplementation(() => {
      throw new Error('Test error');
    });

    await expect(service.status()).rejects.toBeInstanceOf(InsernalServerException);
  });

  it('should handle multiple database connections', async () => {
    const result = await service.status();
    expect(result).toHaveProperty('status', true);
  });

  it('should handle database connection timeout', async () => {
    jest.spyOn(db, 'pingCheck').mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            'up': {
              status: 'up'
            }
          });
        }, 1000);
      });
    });
    const result = await service.status();
    expect(result).toHaveProperty('status', true);
  });

  it('should handle HealthCheckService error with multiple connections', async () => {
    jest.spyOn(healthCheckService, 'check').mockImplementation(() => {
      throw new Error('Test error');
    });

    await expect(service.status()).rejects.toBeInstanceOf(InsernalServerException);
  });
});