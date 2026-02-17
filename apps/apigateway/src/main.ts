import { NestFactory } from '@nestjs/core';
import { ApigatewayModule } from './apigateway.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ApigatewayModule);
  
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('This documentation includes all the endpoints of the microservice exposed by api gateway.')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apidoc', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('APIGATEWAY_PORT', 3000);
  await app.listen(port);
  console.info(`API Gateway running on port ${port}`);
}
bootstrap();
