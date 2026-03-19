import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ExceptionFilter } from './filters/exception-filter/exception.filter';
import { CustomValidationPipe } from './pipes/custom-validation.pipe';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);

  const configService = appContext.get(ConfigService);
  const grpcPort = configService.get<string>('MS_PORT', '50051');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'beatroute.dms.v1',
        protoPath: [
          join(process.cwd(), 'contracts/proto/beatroute/dms/v1/example.proto'),
          join(process.cwd(), 'contracts/proto/beatroute/dms/v1/health.proto'),
        ],
        loader: {
          includeDirs: [join(process.cwd(), 'contracts/proto')],
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
