import { Module } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';
import { GrpcClientModule } from '../../grpc-client/grpc-client.module';

@Module({
  imports: [GrpcClientModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
