import { GrpcContextInterceptor } from '@beatroute/request-context';

describe('GrpcContextInterceptor', () => {
  it('should be defined', () => {
    expect(new GrpcContextInterceptor()).toBeDefined();
  });
});
