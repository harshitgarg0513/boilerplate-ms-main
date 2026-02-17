import {
  ExampleViewRequestDto,
  Example,
  ExampleServiceClient,
  EXAMPLE_SERVICE_NAME,
} from 'proto/beatroute/dms/example';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import { Observable } from 'rxjs';

@Injectable()
export class AuthGrpcClientService {
  private exampleService: ExampleServiceClient;

  constructor(@Inject(EXAMPLE_SERVICE_NAME) private client: ClientGrpc) {
    this.exampleService =
      this.client.getService<ExampleServiceClient>(EXAMPLE_SERVICE_NAME);
  }

  getExample(id: number): Observable<Example> {
    const request: ExampleViewRequestDto = { id };
    return this.exampleService.view(request);
  }
}
