import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import { Observable } from 'rxjs';
import { AUTH_SERVICE_NAME, AuthenticateRequestDto, AuthenticateResponseDto, AuthServiceClient } from 'proto/beatroute/auth/auth';
import { Auth } from 'typeorm';

@Injectable()
export class AuthGrpcClientService {
  private authClientService: AuthServiceClient;

  constructor(@Inject(AUTH_SERVICE_NAME) private client: ClientGrpc) {
    this.authClientService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  authenticate(token: string): Observable<AuthenticateResponseDto> {
    const request: AuthenticateRequestDto = { token };
    return this.authClientService.authenticate(request);
  }
}
