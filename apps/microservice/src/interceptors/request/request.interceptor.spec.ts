import { RequestInterceptor } from './request.interceptor';

describe('RequestInterceptor', () => {
  it('should be defined', () => {
    const mockJwtService: any = { verify: jest.fn() };
    expect(new RequestInterceptor(mockJwtService)).toBeDefined();
  });
});
