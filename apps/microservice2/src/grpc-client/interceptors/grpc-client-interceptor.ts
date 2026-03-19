import { InterceptingCall } from '@grpc/grpc-js';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class GrpcClientInterceptor {
  constructor(@Inject(REQUEST) private readonly request: any) {}

  intercept(options, nextCall) {
    const jwtToken = this.request['jwtToken'];
    return new InterceptingCall(nextCall(options), {
      start: (metadata, listener, next) => {
        metadata.add('authorization', `Bearer ${jwtToken}`);
        next(metadata, listener);
      },
    });
  }
}
