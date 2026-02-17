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
import { AuthGuard as SharedAuthGuard, RoleAccessGuard } from '@beatroute/auth';
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
      useFactory: (jwtService: JwtService) => {
        console.log('[APP_GUARD] registering AuthGuard wrapper');
        const shared = new SharedAuthGuard(jwtService);
        return {
          async canActivate(context: ExecutionContext) {
            console.log('[AuthGuardWrapper] canActivate called');
            try {
              return await shared.canActivate(context as any);
            } catch (err) {
              console.log('[AuthGuardWrapper] caught error from shared guard:', err && err.message);
              // Convert plain Unauthorized errors (from shared package) into RpcException
              if (err && err.message === 'Unauthorized') {
                console.log('[AuthGuardWrapper] converting to RpcException(UNAUTHENTICATED)');
                throw new RpcException({ code: Status.UNAUTHENTICATED, message: 'Unauthorized', error_data: null });
              }
              throw err;
            }
          },
        };
      },
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
