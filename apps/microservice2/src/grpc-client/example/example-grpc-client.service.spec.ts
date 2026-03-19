import { Test, TestingModule } from '@nestjs/testing';
import { ExampleGrpcClientService } from './example-grpc-client.service';

describe('GrpcClientService', () => {
  let service: ExampleGrpcClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExampleGrpcClientService],
    }).compile();

    service = module.get<ExampleGrpcClientService>(ExampleGrpcClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
