import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HealthGrpcClientService } from '../../grpc-client/health/health-grpc-client.service';

@Injectable()
export class HealthService {
  constructor(private readonly healthClientService: HealthGrpcClientService) {}
  async checkStatus() {
    try {
      return this.healthClientService.healthCheck();
    } catch (err) {
      throw new InternalServerErrorException('Unhealthy!');
    }
  }
}
