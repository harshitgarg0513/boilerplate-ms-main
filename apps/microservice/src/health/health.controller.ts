import { Controller } from '@nestjs/common';
import {
  HealthCheckResponse,
  HealthServiceController,
  HealthServiceControllerMethods,
} from 'proto/beatroute/dms/health';
import { Observable } from 'rxjs';
import { HealthService } from './health.service';

@Controller()
@HealthServiceControllerMethods()
export class HealthController implements HealthServiceController {
  constructor(private readonly healthService: HealthService) {}
  checkHealth():
    | Promise<HealthCheckResponse>
    | Observable<HealthCheckResponse>
    | HealthCheckResponse {
    return this.healthService.status();
  }
}
