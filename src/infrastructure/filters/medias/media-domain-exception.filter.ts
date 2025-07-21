import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseMapperMediaService } from '@/application/services/medias/response-mapper-media.service';
import { MediaDomainError } from '@/domain/exceptions/medias/media-domain.errors';

@Catch(MediaDomainError)
export class MediaDomainExceptionFilter implements ExceptionFilter {
  constructor(private readonly responseMapper: ResponseMapperMediaService) {}

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
