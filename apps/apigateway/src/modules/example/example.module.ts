import { Module } from '@nestjs/common';
import { ExampleController } from './example.controller';
import { ExampleService } from './example.service';
import { GrpcClientModule } from '../../grpc-client/grpc-client.module';

@Module({
  imports: [GrpcClientModule],
  controllers: [ExampleController],
  providers: [ExampleService],
})
export class ExampleModule {}
