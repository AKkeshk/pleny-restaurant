import { ApiProperty } from '@nestjs/swagger';
import { IsString } from "class-validator";


export class CreateCuisineInput {
    @ApiProperty({ example: 'Italian' })
    @IsString()
    name: string
}
