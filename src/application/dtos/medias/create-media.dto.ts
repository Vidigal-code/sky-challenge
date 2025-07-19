import {
    IsString,
    IsNotEmpty,
    IsIn,
    IsInt,
    Min,
    Max,
    IsOptional,
    IsUrl,
    IsDateString,
} from 'class-validator';

export class CreateMediaDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsIn(['movie', 'series'])
    type: 'movie' | 'series';

    @IsInt()
    @Min(1900)
    @Max(new Date().getFullYear() + 1)
    releaseYear: number;

    @IsString()
    @IsNotEmpty()
    genre: string;

    @IsOptional()
    @IsString()
    langCode?: string;

    @IsOptional()
    @IsUrl()
    imageUrl?: string;

    @IsOptional()
    @IsUrl()
    trailerUrl?: string;

    @IsOptional()
    @IsDateString()
    releaseDate?: string;
}