import { GrpcContextInterceptor } from '@beatroute-ms/request-context';

describe('GrpcContextInterceptor', () => {
  it('should be defined', () => {
    expect(new GrpcContextInterceptor()).toBeDefined();
  });
});
