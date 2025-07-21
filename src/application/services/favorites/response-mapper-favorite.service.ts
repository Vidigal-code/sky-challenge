import { Injectable, HttpStatus } from '@nestjs/common';
import { ErrorResponse } from '@/shared/responses/responses.interface';
import {
  FavoriteNotFoundError,
  FavoriteAlreadyExistsError,
  FavoriteUnexpectedError,
  FavoriteDomainError,
} from '@/domain/exceptions/favorites/favorite-domain.errors';
import { MediaNotFoundError } from '@/domain/exceptions/medias/media-domain.errors';
import { UserNotFoundError } from '@/domain/exceptions/users/user-domain.errors';

interface ErrorMapping {
  errorType: new (...args: any[]) => Error;
  statusCode: HttpStatus;
  errorName: string;
}

@Injectable()
export class ResponseMapperFavoriteService {
  private readonly errorMappings: ErrorMapping[] = [
    {
      errorType: FavoriteNotFoundError,
      statusCode: HttpStatus.NOT_FOUND,
      errorName: 'Not Found',
    },
    {
      errorType: FavoriteAlreadyExistsError,
      statusCode: HttpStatus.CONFLICT,
      errorName: 'Conflict',
    },
    {
      errorType: MediaNotFoundError,
      statusCode: HttpStatus.NOT_FOUND,
      errorName: 'Not Found',
    },
    {
      errorType: UserNotFoundError,
      statusCode: HttpStatus.NOT_FOUND,
      errorName: 'Not Found',
    },
    {
      errorType: FavoriteUnexpectedError,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      errorName: 'Internal Server Error',
    },
  ];

  toErrorResponse(error: unknown, path: string, method: string): ErrorResponse {
    const timestamp = new Date().toISOString();

    const mapping = this.errorMappings.find(
      (m) => error instanceof m.errorType
    );

    if (mapping) {
      return {
        success: false,
        statusCode: mapping.statusCode,
        error: mapping.errorName,
        message: (error as Error).message,
        code: (error as FavoriteDomainError).code || 'UNKNOWN_ERROR',
        timestamp,
        path,
        method,
      };
    }

    return {
      success: false,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: (error as Error)?.message || 'Erro interno do servidor',
      timestamp,
      path,
      method,
    };
  }
}
