import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreateRestaurantDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string
}
