import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseMapperFavoriteService } from '@/application/services/favorites/response-mapper-favorite.service';
import { FavoriteDomainError } from '@/domain/exceptions/favorites/favorite-domain.errors';
import { MediaNotFoundError } from '@/domain/exceptions/medias/media-domain.errors';
import { UserNotFoundError } from '@/domain/exceptions/users/user-domain.errors';

@Catch(FavoriteDomainError, MediaNotFoundError, UserNotFoundError)
export class FavoriteDomainExceptionFilter implements ExceptionFilter {
  constructor(private readonly responseMapper: ResponseMapperFavoriteService) {}

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
