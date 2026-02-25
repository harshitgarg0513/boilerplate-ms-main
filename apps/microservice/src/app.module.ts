import { Module } from '@nestjs/common';
import { GrpcClientModule } from './grpc-client/grpc-client.module';
import { ExampleModule } from './modules/example/example.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.config';
import { HealthModule } from './health/health.module';
import { APP_GUARD, APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { RequestInterceptor } from './interceptors/request/request.interceptor';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthGuard as SharedAuthGuard, RoleAccessGuard } from '@beatroute-ms/auth';
import { RpcException } from '@nestjs/microservices';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { ExecutionContext } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { DatabaseModule } from './config/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('AUTH_JWT_SECRET'),
      }),
    }),
    GrpcClientModule,
    DatabaseModule,
    ExampleModule,
    HealthModule,
    CoreModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useFactory: (jwtService: JwtService) => new SharedAuthGuard(jwtService),
      inject: [JwtService],
    },
    {
      provide: APP_GUARD,
      useFactory: (reflector: Reflector) => new RoleAccessGuard(reflector),
      inject: [Reflector],
    },
  ],
})
export class AppModule {}
