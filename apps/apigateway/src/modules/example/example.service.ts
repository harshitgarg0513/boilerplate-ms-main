import { Injectable } from '@nestjs/common';
import { ExampleRequestDto } from 'proto/beatroute/dms/example';
import { ExampleGrpcClientService } from '../../grpc-client/example/example-grpc-client.service';

@Injectable()
export class ExampleService {
  constructor(private exampleClientService: ExampleGrpcClientService) {}

  create(exampleRequestDto: ExampleRequestDto) {
    return this.exampleClientService.createExample(exampleRequestDto);
  }

  findAll() {
    return this.exampleClientService.getAllExamples(1);
  }

  findOne(id: number) {
    return this.exampleClientService.getExample(id);
  }

  update(id: number, exampleRequestDto: ExampleRequestDto) {
    return this.exampleClientService.createExample(exampleRequestDto);
  }

  remove(id: number) {
    return this.exampleClientService.deleteExample(id);
  }
}
