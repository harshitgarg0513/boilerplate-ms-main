import { GatewayRpcToHttpExceptionFilter } from '@beatroute-ms/error-handling';

describe('GatewayRpcToHttpExceptionFilter', () => {
  it('should be defined', () => {
    expect(new GatewayRpcToHttpExceptionFilter()).toBeDefined();
  });
});
