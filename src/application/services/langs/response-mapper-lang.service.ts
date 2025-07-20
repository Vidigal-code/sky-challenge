import { Injectable, HttpStatus } from '@nestjs/common';
import { ErrorResponse } from '@/shared/responses/responses.interface';
import {
  LangNotFoundError,
  LangAlreadyExistsError,
  LangInvalidDataError,
  LangUnexpectedError,
  LangDomainError,
} from '@/domain/exceptions/langs/lang-domain.errors';

interface ErrorMapping {
  errorType: new (...args: any[]) => LangDomainError;
  statusCode: HttpStatus;
  errorName: string;
}

@Injectable()
export class ResponseMapperLangService {
  private readonly errorMappings: ErrorMapping[] = [
    {
      errorType: LangNotFoundError,
      statusCode: HttpStatus.NOT_FOUND,
      errorName: 'Not Found',
    },
    {
      errorType: LangAlreadyExistsError,
      statusCode: HttpStatus.CONFLICT,
      errorName: 'Conflict',
    },
    {
      errorType: LangInvalidDataError,
      statusCode: HttpStatus.BAD_REQUEST,
      errorName: 'Bad Request',
    },
    {
      errorType: LangUnexpectedError,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      errorName: 'Internal Server Error',
    },
  ];

  toErrorResponse(error: unknown, path: string, method: string): ErrorResponse {
    const timestamp = new Date().toISOString();

    if (error instanceof LangDomainError) {
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
