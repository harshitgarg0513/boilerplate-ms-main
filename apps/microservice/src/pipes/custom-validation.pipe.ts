import { Injectable, ValidationPipe, ValidationError } from '@nestjs/common';
import { ValidationPipeOptions } from '@nestjs/common/pipes/validation.pipe';
import { RpcException } from '@nestjs/microservices';
import { GrpcException } from '../exceptions/grpc.exception';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { ValidationException } from '../exceptions/validation.exception';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      disableErrorMessages: true,
      exceptionFactory: (errors) => this.formatException(errors),
      ...options,
    });
  }

  private formatException(errors: ValidationError[]): RpcException {
    console.log(errors);
    const formattedErrors = errors.map((error) => {
      const constraints = error.constraints
        ? Object.values(error.constraints).join(', ')
        : 'Validation failed';
      return {
        property: error.property,
        constraints: constraints,
      };
    });

    return new ValidationException('Validation failed', formattedErrors);
  }
}
