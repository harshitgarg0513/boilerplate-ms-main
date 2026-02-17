import { RequestMiddleware } from './request.middleware';

describe('RequestMiddleware', () => {
  it('should be defined', () => {
    const mockAuthGrpcClientService: any = {
      authenticate: (token: string) => ({ toPromise: async () => ({ jwtToken: '' }) }),
    };

    expect(new RequestMiddleware(mockAuthGrpcClientService)).toBeDefined();
  });
});
