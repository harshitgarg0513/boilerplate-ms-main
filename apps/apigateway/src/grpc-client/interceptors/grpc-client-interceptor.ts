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
          // Send raw token in gRPC metadata (AuthGuard will accept both formats)
          const token = jwtToken.startsWith('Bearer ') ? jwtToken.slice(7).trim() : jwtToken;
          metadata.add('authorization', token);
        }
        // Forward x-request-context (stringified JSON or plain string) if present
        const xRequestContext = this.request['xRequestContext'] || this.request.headers?.['x-request-context'];
        if (xRequestContext) {
          const value = typeof xRequestContext === 'string' ? xRequestContext : JSON.stringify(xRequestContext);
          metadata.add('x-request-context', value);
        }
        next(metadata, listener);
      },
    });
  }
}
