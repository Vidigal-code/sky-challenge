import { Injectable, HttpStatus } from '@nestjs/common';
import { ErrorResponse } from '@/shared/responses/responses.interface';
import {
  MediaNotFoundError,
  MediaAlreadyExistsError,
  MediaInvalidDataError,
  MediaUnexpectedError,
  MediaDomainError,
} from '@/domain/exceptions/medias/media-domain.errors';

interface ErrorMapping {
  errorType: new (...args: any[]) => MediaDomainError;
  statusCode: HttpStatus;
  errorName: string;
}

@Injectable()
export class ResponseMapperMediaService {
  private readonly errorMappings: ErrorMapping[] = [
    {
      errorType: MediaNotFoundError,
      statusCode: HttpStatus.NOT_FOUND,
      errorName: 'Not Found',
    },
    {
      errorType: MediaAlreadyExistsError,
      statusCode: HttpStatus.CONFLICT,
      errorName: 'Conflict',
    },
    {
      errorType: MediaInvalidDataError,
      statusCode: HttpStatus.BAD_REQUEST,
      errorName: 'Bad Request',
    },
    {
      errorType: MediaUnexpectedError,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      errorName: 'Internal Server Error',
    },
  ] as ErrorMapping[];

  toErrorResponse(error: unknown, path: string, method: string): ErrorResponse {
    const timestamp = new Date().toISOString();

    if (error instanceof MediaDomainError) {
      const mapping = this.errorMappings.find(
        (m) => error instanceof m.errorType
      );
      return {
        success: false,
        statusCode: mapping?.statusCode || HttpStatus.BAD_REQUEST,
        error: mapping?.errorName || 'Bad Request',
        message: error.message,
        code: error.code,
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
