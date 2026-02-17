import { Status } from '@grpc/grpc-js/build/src/constants';
import { RpcException } from '@nestjs/microservices';

export class GrpcException extends RpcException {
  constructor(message: string, code: Status = Status.UNKNOWN, data?: any[] | object | any) {
    super({
      code: code,
      message: message,
      error_data: data, 
    });
  }
}
