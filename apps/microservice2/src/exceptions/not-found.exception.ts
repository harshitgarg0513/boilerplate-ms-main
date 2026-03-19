import { Status } from '@grpc/grpc-js/build/src/constants';
import { RpcException } from '@nestjs/microservices';
import { GrpcException } from './grpc.exception';

export class NotFoundException extends GrpcException {
  constructor(message: string, data?: any[] | object | any) {
    super(message, Status.NOT_FOUND, data);
  }
}
