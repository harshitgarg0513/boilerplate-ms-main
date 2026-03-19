import { Module } from '@nestjs/common';
import { GrpcClientModule } from './grpc-client/grpc-client.module';
import { ExampleModule } from './modules/example/example.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.config';
import { HealthModule } from './health/health.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RequestInterceptor } from './interceptors/request/request.interceptor';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';
import { RoleAccessGuard } from './guards/role-access.guard';
import { CoreModule } from './core/core.module';
import { DatabaseModule } from './config/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
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
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleAccessGuard,
    }
  ],
})
export class AppModule {}
