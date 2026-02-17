import { Status } from '@grpc/grpc-js/build/src/constants';
import { GrpcException } from './grpc.exception';

export class UnavailableServerException extends GrpcException {
  constructor(message: string, data?: any[] | object | any) {
    super(message, Status.UNAVAILABLE, data);
  }
}
