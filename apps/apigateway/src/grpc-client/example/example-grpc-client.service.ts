import {
  ExampleRequestDto,
  ExampleViewRequestDto,
  ExampleResponseListDto,
  Example,
  ExampleServiceClient,
  EXAMPLE_SERVICE_NAME,
} from 'proto/beatroute/dms/example';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import { Observable } from 'rxjs';

@Injectable()
export class ExampleGrpcClientService {
  private exampleService: ExampleServiceClient;

  constructor(@Inject(EXAMPLE_SERVICE_NAME) private client: ClientGrpc) {
    this.exampleService =
      this.client.getService<ExampleServiceClient>(EXAMPLE_SERVICE_NAME);
  }

  getExample(id: number): Observable<Example> {
    const request: ExampleViewRequestDto = { id };
    return this.exampleService.view(request);
  }

  getAllExamples(page: number): Observable<ExampleResponseListDto> {
    return this.exampleService.index({page});
  }

  createExample(exampleRequestDto: ExampleRequestDto): Observable<Example> {
    return this.exampleService.create(exampleRequestDto);
  }

  deleteExample(id: number) {
    return this.exampleService.delete({ id });
  }
}
