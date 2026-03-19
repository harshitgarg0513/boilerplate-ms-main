import { ExceptionFilter } from './exception.filter';

describe('RpcToHttpExceptionFilter', () => {
  it('should be defined', () => {
    expect(new ExceptionFilter()).toBeDefined();
  });
});
