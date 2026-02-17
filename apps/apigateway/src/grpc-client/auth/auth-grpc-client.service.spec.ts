import { Test, TestingModule } from '@nestjs/testing';
import { AuthGrpcClientService } from './auth-grpc-client.service';

describe('AuthGrpcClientService', () => {
  let service: AuthGrpcClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGrpcClientService],
    }).compile();

    service = module.get<AuthGrpcClientService>(AuthGrpcClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
