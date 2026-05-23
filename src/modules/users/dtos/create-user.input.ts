import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class CreateUserInput {
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    fullName: string;

    @ApiPropertyOptional({
        example: ['6650f1f2a9b3c4d5e6f78901'],
        type: [String],
    })
    @IsMongoId({ each: true })
    favoriteCuisines?: string[];
}
