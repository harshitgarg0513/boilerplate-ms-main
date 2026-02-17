import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExampleService } from './example.service';
import { ExampleRequestDto } from 'proto/beatroute/dms/example';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('example')
@ApiBearerAuth()
@Controller('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Post('create')
  create(@Body() createExampleDto: ExampleRequestDto) {
    return this.exampleService.create(createExampleDto);
  }

  @Get('index')
  findAll() {
    return this.exampleService.findAll();
  }

  @Get('view:id')
  findOne(@Param('id') id: string) {
    return this.exampleService.findOne(+id);
  }

  @Patch('update:id')
  update(@Param('id') id: string, @Body() updateExampleDto: ExampleRequestDto) {
    return this.exampleService.update(+id, updateExampleDto);
  }

  @Delete('delete:id')
  remove(@Param('id') id: string) {
    return this.exampleService.remove(+id);
  }
}
