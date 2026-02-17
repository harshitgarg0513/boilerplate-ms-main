import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { resolve } from 'path';
import { ConfigService } from '@nestjs/config';
import { ExceptionFilter } from './filters/exception-filter/exception.filter';
import { CustomValidationPipe } from './pipes/custom-validation.pipe';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);

  const configService = appContext.get(ConfigService);
  console.log('[microservice] AUTH_JWT_SECRET=', configService.get<string>('AUTH_JWT_SECRET'));
  const grpcPort = configService.get<string>('MS_PORT', '5000');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'beatroute.dms',
        protoPath: [
          resolve(process.cwd(), 'proto/beatroute/dms/example.proto'),
          resolve(process.cwd(), 'proto/beatroute/dms/health.proto'),
        ],
        loader: {
          includeDirs: [resolve(process.cwd(), 'proto')],
        },

        url: `0.0.0.0:${grpcPort}`,
      },
    },
  );

  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalFilters(new ExceptionFilter());

  await app.listen();
  console.info(`Microservice running on port ${grpcPort}`);
}
bootstrap();
