import { Module } from '@nestjs/common';
import { ExampleGrpcClientService } from './example/example-grpc-client.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GrpcClientInterceptor } from './interceptors/grpc-client-interceptor';
import { EXAMPLE_SERVICE_NAME } from 'proto/beatroute/dms/example';
import {
  HEALTH_SERVICE_NAME,
} from 'proto/beatroute/dms/health';
import { HealthGrpcClientService } from './health/health-grpc-client.service';
import { AUTH_SERVICE_NAME, BEATROUTE_AUTH_PACKAGE_NAME } from 'proto/beatroute/auth/auth';
import { AuthGrpcClientService } from './auth/auth-grpc-client.service';

const DMS_V1_PACKAGE_NAME = 'beatroute.dms.v1';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE_NAME,
        imports: [ConfigModule],
        extraProviders: [GrpcClientInterceptor],
        useFactory: async (
          configService: ConfigService,
          grpcClientInterceptor: GrpcClientInterceptor,
        ) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.get<string>('GRPC_AUTH_MS_URL'),
            package: BEATROUTE_AUTH_PACKAGE_NAME,
            protoPath: join(process.cwd(), 'proto/beatroute/auth/auth.proto'),
            loader: {
              includeDirs: [join(process.cwd())],
            },
            channelOptions: {
              interceptors: [
                (options, nextCall) => {
                  return grpcClientInterceptor.intercept(options, nextCall);
                },
              ],
            },
          },
        }),
        inject: [ConfigService, GrpcClientInterceptor],
      },
      {
        name: EXAMPLE_SERVICE_NAME,
        imports: [ConfigModule],
        extraProviders: [GrpcClientInterceptor],
        useFactory: async (
          configService: ConfigService,
          grpcClientInterceptor: GrpcClientInterceptor,
        ) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.get<string>('GRPC_DMS_MS_URL'),
            package: DMS_V1_PACKAGE_NAME,
            protoPath: join(process.cwd(), 'contracts/proto/beatroute/dms/v1/example.proto'),
            loader: {
              includeDirs: [join(process.cwd(), 'contracts/proto')],
            },
            channelOptions: {
              interceptors: [
                (options, nextCall) => {
                  return grpcClientInterceptor.intercept(options, nextCall);
                },
              ],
            },
          },
        }),
        inject: [ConfigService, GrpcClientInterceptor],
      },
      {
        name: HEALTH_SERVICE_NAME,
        imports: [ConfigModule],
        extraProviders: [GrpcClientInterceptor],
        useFactory: async (
          configService: ConfigService,
          grpcClientInterceptor: GrpcClientInterceptor,
        ) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.get<string>('GRPC_DMS_MS_URL'),
            package: DMS_V1_PACKAGE_NAME,
            protoPath: join(process.cwd(), 'contracts/proto/beatroute/dms/v1/health.proto'),
            loader: {
              includeDirs: [join(process.cwd(), 'contracts/proto')],
            },
            channelOptions: {
              interceptors: [
                (options, nextCall) => {
                  return grpcClientInterceptor.intercept(options, nextCall);
                },
              ],
            },
          },
        }),
        inject: [ConfigService, GrpcClientInterceptor],
      },
    ]),
  ],
  providers: [ExampleGrpcClientService, HealthGrpcClientService, AuthGrpcClientService],
  exports: [ExampleGrpcClientService, HealthGrpcClientService, AuthGrpcClientService],
})
export class GrpcClientModule {}
