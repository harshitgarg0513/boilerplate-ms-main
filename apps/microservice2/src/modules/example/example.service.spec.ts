import { Test, TestingModule } from '@nestjs/testing';
import { ExampleService } from './example.service';
import { UserIdentityService } from '../../services/user-identity.service';

describe('ExampleService', () => {
  let service: ExampleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExampleService,
        {
          provide: UserIdentityService,
          useValue: {
            getUser: jest.fn(),
          },
        }
      ],
    }).compile();

    service = module.get<ExampleService>(ExampleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
