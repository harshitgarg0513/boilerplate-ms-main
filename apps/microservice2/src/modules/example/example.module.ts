import { UserIdentityService } from './../../services/user-identity.service';
import { Module } from '@nestjs/common';
import { ExampleService } from './example.service';
import { ExampleController } from './example.controller';
import { TeamModule } from '../../core/team/team.module';
import { CoreModule } from '../../core/core.module';
import { GrpcClientModule } from '../../grpc-client/grpc-client.module';

@Module({
  imports: [GrpcClientModule],
  controllers: [ExampleController],
  providers: [ExampleService, UserIdentityService],
})
export class ExampleModule {}
