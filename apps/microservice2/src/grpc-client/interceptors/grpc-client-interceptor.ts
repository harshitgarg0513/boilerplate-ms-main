import { InterceptingCall } from '@grpc/grpc-js';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class GrpcClientInterceptor {
  constructor(@Inject(REQUEST) private readonly request: any) {}

  private resolveJwtToken(): string {
    const directToken = this.request?.jwtToken;
    if (typeof directToken === 'string' && directToken.trim().length > 0) {
      return directToken;
    }

    const contextToken = this.request?.context?.jwtToken;
    if (typeof contextToken === 'string' && contextToken.trim().length > 0) {
      return contextToken;
    }

    const metadata = this.request?.context?.metadata;
    const rawAuthHeader = metadata?.get?.('authorization')?.[0] || metadata?.get?.('Authorization')?.[0];
    if (typeof rawAuthHeader === 'string' && rawAuthHeader.trim().length > 0) {
      return rawAuthHeader.replace(/^Bearer\s+/i, '').trim();
    }

    // Last-resort fallback for internal service-to-service calls.
    const identity = this.request?.context?.identity;
    const secret = process.env.AUTH_JWT_SECRET;
    if (identity && secret) {
      return jwt.sign(
        {
          id: identity.id,
          companyId: identity.companyId,
          role: identity.role,
          sub: identity.id,
        },
        secret,
        { expiresIn: '15m' },
      );
    }

    return '';
  }

  intercept(options, nextCall) {
    const jwtToken = this.resolveJwtToken();
    return new InterceptingCall(nextCall(options), {
      start: (metadata, listener, next) => {
        if (jwtToken) {
          metadata.add('authorization', `Bearer ${jwtToken}`);
        }
        next(metadata, listener);
      },
    });
  }
}
