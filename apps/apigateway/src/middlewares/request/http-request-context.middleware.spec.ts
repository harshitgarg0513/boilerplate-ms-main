import { HttpRequestContextMiddleware } from '@beatroute/request-context';

describe('HttpRequestContextMiddleware', () => {
  it('should be defined', () => {
    expect(new HttpRequestContextMiddleware()).toBeDefined();
  });
});
