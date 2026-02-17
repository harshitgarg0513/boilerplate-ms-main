import { GrpcClientModule } from './grpc-client/grpc-client.module';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ResponseInterceptor } from './interceptors/response/response.interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { RpcToHttpExceptionFilter } from './filters/rpc-to-http-exception/rpc-to-http-exception.filter';
import { ExampleModule } from './modules/example/example.module';
import { RequestMiddleware } from './middlewares/request/request.middleware';
import { GrpcClientInterceptor } from './grpc-client/interceptors/grpc-client-interceptor';
import { HealthModule } from './modules/health/health.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GrpcClientModule,
    ExampleModule,
    HealthModule,
  ],
  controllers: [],
  providers: [
    GrpcClientInterceptor,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: RpcToHttpExceptionFilter,
    },
  ],
})
export class ApigatewayModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
