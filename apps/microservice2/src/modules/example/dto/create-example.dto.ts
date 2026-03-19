import { IsString, MaxLength } from 'class-validator';
import { ExampleRequestDto } from 'proto/beatroute/dms/example';

export class CreateExampleDto implements ExampleRequestDto {
  @IsString()
  @MaxLength(64)
  name: string;

  @IsString()
  @MaxLength(512)
  description: string;
}
