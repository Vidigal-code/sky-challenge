import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseMapperLangService } from '@/application/services/langs/response-mapper-lang.service';
import { LangDomainError } from '@/domain/exceptions/langs/lang-domain.errors';

@Catch(LangDomainError)
export class LangDomainExceptionFilter implements ExceptionFilter {
  constructor(private readonly responseMapper: ResponseMapperLangService) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = this.responseMapper.toErrorResponse(
      exception,
      request.url,
      request.method
    );

    response.status(errorResponse.statusCode).json(errorResponse);
  }
}
