import { ApiProperty } from '@nestjs/swagger';

export class RestaurantResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({nullable: true})
  slug: string | null;
}