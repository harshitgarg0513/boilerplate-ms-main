import { GatewayRpcToHttpExceptionFilter } from '@beatroute/error-handling';

describe('GatewayRpcToHttpExceptionFilter', () => {
  it('should be defined', () => {
    expect(new GatewayRpcToHttpExceptionFilter()).toBeDefined();
  });
});
