import { HttpRequestContextMiddleware } from '@beatroute-ms/request-context';

describe('HttpRequestContextMiddleware', () => {
  it('should be defined', () => {
    expect(new HttpRequestContextMiddleware()).toBeDefined();
  });
});
