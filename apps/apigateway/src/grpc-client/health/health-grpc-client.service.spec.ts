import { Test, TestingModule } from '@nestjs/testing';
import { HealthGrpcClientService } from './health-grpc-client.service';

describe('GrpcClientService', () => {
  let service: HealthGrpcClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthGrpcClientService],
    }).compile();

    service = module.get<HealthGrpcClientService>(HealthGrpcClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
