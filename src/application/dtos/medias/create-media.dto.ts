import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsIn,
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
  releaseYear: number;

  @IsString()
  @IsNotEmpty()
  genre: string;

  @IsInt()
  genreId: number;

  @IsString()
  @IsOptional()
  langCode?: string;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsUrl()
  @IsOptional()
  trailerUrl?: string;

  @IsOptional()
  @IsDateString()
  releaseDate?: string;
}
