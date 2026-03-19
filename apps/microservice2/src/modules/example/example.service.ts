import { Injectable } from '@nestjs/common';
import { UpdateExampleDto } from './dto/update-example.dto';
import { Example, ExampleRequestDto } from 'proto/beatroute/dms/example';
import { GetIdentity } from '../../decorators/get-identity.decorator';
import { UserIdentityService } from '../../services/user-identity.service';
import { FilterDto } from './dto/example-filter.dto';
import { PaginationHelper } from '../../helpers/pagination.helper';
import { RouteService } from '../../core/route/services/route.service';
import { SkuService } from '../../core/sku/services/sku.service';
import { UserService } from '../../core/team/services/user.service';

@Injectable()
export class ExampleService {
  private readonly dataList: Example[] = [
    {
      id: 111111,
      name: 'Example 1',
      description: 'Example 1 description',
    },
    {
      id: 2,
      name: 'Example 2',
      description: 'Example 2 description',
    },
    {
      id: 3,
      name: 'Example 3',
      description: 'Example 3 description',
    },
  ];

  
  constructor(private readonly identityService: UserIdentityService) {}
  create(createExampleDto: ExampleRequestDto) {
    const identity = this.identityService.getIdentity();
    console.log('user identity', identity);
    const example: Example = {
      id: 1,
      name: createExampleDto.name,
      description: createExampleDto.description,
    };
    this.dataList.push(example);
    return example;
  }

  async findAll(filterDto: FilterDto) {
    console.log('user', await this.identityService.getUser());
    return {
      examples: this.dataList.slice((filterDto.page - 1) * filterDto.limit, filterDto.page * filterDto.limit),
      pagination: PaginationHelper.getPagination(filterDto.page, this.dataList.length, filterDto.limit),
    };
  }

  findOne(id: number) {
    return this.dataList[0];
  }

  update(id: number, updateExampleDto: UpdateExampleDto) {
    return `This action updates a #${id} example`;
  }

  remove(id: number) {
    return `This action removes a #${id} example`;
  }
}
