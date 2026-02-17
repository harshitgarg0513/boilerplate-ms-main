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
        if (jwtToken) {
          const token = jwtToken.startsWith('Bearer ') ? jwtToken.slice(7).trim() : jwtToken;
          metadata.add('authorization', token);
        }
        next(metadata, listener);
      },
    });
  }
}
