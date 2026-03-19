import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { HealthCheckService, TerminusModule, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { HealthModule } from './health.module';
import { Connection } from 'mysql2/typings/mysql/lib/Connection';

describe('HealthController', () => {
  let healthController: HealthController;
  let healthService: HealthService;
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
      controllers: [HealthController],
      providers: [
        HealthService,
        { provide: TypeOrmHealthIndicator, useValue: db },
        { provide: 'masterDataSource', useValue: masterMysql },
        { provide: 'slaveDataSource', useValue: slaveMysql },
        { provide: 'postgresDataSource', useValue: postgres },
      ],
    }).compile();

    healthController = module.get<HealthController>(HealthController);
    healthService = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(healthController).toBeDefined();
  });

  describe('checkHealth', () => {
    it('should return health check response', async () => {
      const result = await healthController.checkHealth();
      expect(result).toBeDefined();
    });

    it('should return health check response with status true', async () => {
      jest.spyOn(healthService, 'status').mockImplementation(() => {
        return Promise.resolve({ status: true });
      });
      const result = await healthController.checkHealth();
      expect(result).toHaveProperty('status', true);
    });

    it('should return health check response with status false', async () => {
      jest.spyOn(healthService, 'status').mockImplementation(() => {
        return Promise.resolve({ status: false });
      });
      const result = await healthController.checkHealth();
      expect(result).toHaveProperty('status', false);
    });
  });
});
