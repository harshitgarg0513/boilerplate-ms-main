import { Controller, UseGuards } from '@nestjs/common';
import { ExampleService } from './example.service';

import {
  Example,
  ExampleDeleteRequestDto,
  ExampleListRequestDto,
  ExampleResponseListDto,
  ExampleServiceController,
  ExampleServiceControllerMethods,
  ExampleViewRequestDto,
} from 'proto/beatroute/dms/example';
import { Observable } from 'rxjs';
import { Payload } from '@nestjs/microservices';
import { CreateExampleDto } from './dto/create-example.dto';
import { GetIdentity } from '../../decorators/get-identity.decorator';
import { UserIdentity } from 'proto/beatroute/common/user-identity';
import { RoleAccess } from '../../decorators/role-access.decorator';
import { ROLE_ADMIN } from '../../constants/roles.constants';
import { Empty } from 'proto/beatroute/common/empty';
import { FilterDto } from './dto/example-filter.dto';
import { GrpcException } from '../../exceptions/grpc.exception';
import { Status } from '@grpc/grpc-js/build/src/constants';

@Controller()
@ExampleServiceControllerMethods()
export class ExampleController implements ExampleServiceController {
  constructor(private readonly exampleService: ExampleService) {}

  @RoleAccess(ROLE_ADMIN)
  index(requestDto: ExampleListRequestDto):
    | Promise<ExampleResponseListDto>
    | Observable<ExampleResponseListDto>
    | ExampleResponseListDto {
    const filterDto = new FilterDto(requestDto.page, 10);
    return this.exampleService.findAll(filterDto);
  }

  @RoleAccess(ROLE_ADMIN)
  view(
    request: ExampleViewRequestDto,
  ): Promise<Example> | Observable<Example> | Example {
    return this.exampleService.findOne(request.id);
  }

  @RoleAccess(ROLE_ADMIN)
  delete(
    request: ExampleDeleteRequestDto,
  ): Promise<Empty> | Observable<Empty> | Empty {
    return this.exampleService.remove(request.id);
  }

  @RoleAccess(ROLE_ADMIN)
  create(@Payload() createExampleDto: CreateExampleDto) {
    return this.exampleService.create(createExampleDto);
  }
}
