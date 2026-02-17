import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import { Observable } from 'rxjs';
import {
  HEALTH_SERVICE_NAME,
  HealthCheckResponse,
  HealthServiceClient,
} from 'proto/beatroute/dms/health';

@Injectable()
export class HealthGrpcClientService {
  private healthService: HealthServiceClient;

  constructor(@Inject(HEALTH_SERVICE_NAME) private client: ClientGrpc) {
    this.healthService =
      this.client.getService<HealthServiceClient>(HEALTH_SERVICE_NAME);
  }

  healthCheck(): Observable<HealthCheckResponse> {
    return this.healthService.checkHealth({});
  }
}
