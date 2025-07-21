import { Test, TestingModule } from '@nestjs/testing';
import { CreateFavoriteDto } from '@/application/dtos/favorites/create-favorite.dto';
import { FavoriteMessageSuccess } from '@/shared/responses/favorites/favorite-message-success';
import {
  FavoriteNotFoundError,
  FavoriteAlreadyExistsError,
} from '@/domain/exceptions/favorites/favorite-domain.errors';
import { MediaNotFoundError } from '@/domain/exceptions/medias/media-domain.errors';
import { UserNotFoundError } from '@/domain/exceptions/users/user-domain.errors';
import { Medias } from '@/domain/entities/medias/media.entity';
import { Request } from 'express';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { FavoriteController } from '@/infrastructure/http/controllers/favorites/favorite.controller';
import { FavoriteService } from '@/application/services/favorites/favorite.service';
import { ResponseMapperFavoriteService } from '@/application/services/favorites/response-mapper-favorite.service';

describe('FavoritesController', () => {
  let controller: FavoriteController;
  let favoriteService: jest.Mocked<FavoriteService>;
  let responseMapperFavoriteService: jest.Mocked<ResponseMapperFavoriteService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoriteController],
      providers: [
        {
          provide: FavoriteService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: ResponseMapperFavoriteService,
          useValue: {
            toErrorResponse: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FavoriteController>(FavoriteController);
    favoriteService = module.get(FavoriteService);
    responseMapperFavoriteService = module.get(ResponseMapperFavoriteService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a favorite', async () => {
      const createFavoriteDto: CreateFavoriteDto = { mediaId: 1 };
      const userId = 1;
      const successResponse = {
        ...FavoriteMessageSuccess.created(userId, '/users/1/favorites', 'POST'),
        data: null,
      };

      favoriteService.create.mockResolvedValue(successResponse);
      const req: Partial<Request> = {
        url: '/users/1/favorites',
        method: 'POST',
      };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await controller.create(
        userId,
        createFavoriteDto,
        req as Request,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
      expect(res.send).toHaveBeenCalled();
      expect(favoriteService.create).toHaveBeenCalledWith(
        userId,
        createFavoriteDto,
        '/users/1/favorites',
        'POST'
      );
    });

    it('should handle MediaNotFoundError', async () => {
      const createFavoriteDto: CreateFavoriteDto = { mediaId: 1 };
      const userId = 1;
      const error = new MediaNotFoundError(1);
      const errorResponse = {
        success: false,
        statusCode: 404,
        error: 'Not Found',
        message: 'Mídia com ID 1 não encontrada',
        code: 'MEDIA_NOT_FOUND',
        timestamp: expect.any(String),
        path: '/users/1/favorites',
        method: 'POST',
      };

      favoriteService.create.mockRejectedValue(error);
      responseMapperFavoriteService.toErrorResponse.mockReturnValue(
        errorResponse
      );
      const req: Partial<Request> = {
        url: '/users/1/favorites',
        method: 'POST',
      };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.create(
        userId,
        createFavoriteDto,
        req as Request,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(errorResponse);
      expect(favoriteService.create).toHaveBeenCalledWith(
        userId,
        createFavoriteDto,
        '/users/1/favorites',
        'POST'
      );
      expect(
        responseMapperFavoriteService.toErrorResponse
      ).toHaveBeenCalledWith(error, '/users/1/favorites', 'POST');
    });

    it('should handle FavoriteAlreadyExistsError', async () => {
      const createFavoriteDto: CreateFavoriteDto = { mediaId: 1 };
      const userId = 1;
      const error = new FavoriteAlreadyExistsError();
      const errorResponse = {
        success: false,
        statusCode: 409,
        error: 'Conflict',
        message: 'Favorito já existe',
        code: 'FAVORITE_ALREADY_EXISTS',
        timestamp: expect.any(String),
        path: '/users/1/favorites',
        method: 'POST',
      };

      favoriteService.create.mockRejectedValue(error);
      responseMapperFavoriteService.toErrorResponse.mockReturnValue(
        errorResponse
      );
      const req: Partial<Request> = {
        url: '/users/1/favorites',
        method: 'POST',
      };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.create(
        userId,
        createFavoriteDto,
        req as Request,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(errorResponse);
      expect(favoriteService.create).toHaveBeenCalledWith(
        userId,
        createFavoriteDto,
        '/users/1/favorites',
        'POST'
      );
      expect(
        responseMapperFavoriteService.toErrorResponse
      ).toHaveBeenCalledWith(error, '/users/1/favorites', 'POST');
    });
  });

  describe('findAll', () => {
    it('should return all favorites', async () => {
      const userId = 1;
      const medias = [new Medias()];
      const successResponse = {
        ...FavoriteMessageSuccess.retrievedAll(
          userId,
          '/users/1/favorites',
          'GET'
        ),
        data: { medias },
      };

      favoriteService.findAll.mockResolvedValue(successResponse);
      const req: Partial<Request> = {
        url: '/users/1/favorites',
        method: 'GET',
      };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.findAll(userId, req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(successResponse);
      expect(favoriteService.findAll).toHaveBeenCalledWith(
        userId,
        '/users/1/favorites',
        'GET'
      );
    });

    it('should handle UserNotFoundError', async () => {
      const userId = 1;
      const error = new UserNotFoundError(userId);
      const errorResponse = {
        success: false,
        statusCode: 404,
        error: 'Not Found',
        message: `Usuário com ID ${userId} não encontrado`,
        code: 'USER_NOT_FOUND',
        timestamp: expect.any(String),
        path: '/users/1/favorites',
        method: 'GET',
      };

      favoriteService.findAll.mockRejectedValue(error);
      responseMapperFavoriteService.toErrorResponse.mockReturnValue(
        errorResponse
      );
      const req: Partial<Request> = {
        url: '/users/1/favorites',
        method: 'GET',
      };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.findAll(userId, req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(errorResponse);
      expect(favoriteService.findAll).toHaveBeenCalledWith(
        userId,
        '/users/1/favorites',
        'GET'
      );
      expect(
        responseMapperFavoriteService.toErrorResponse
      ).toHaveBeenCalledWith(error, '/users/1/favorites', 'GET');
    });
  });

  describe('remove', () => {
    it('should remove a favorite', async () => {
      const userId = 1;
      const mediaId = 1;
      const successResponse = {
        ...FavoriteMessageSuccess.removed(
          userId,
          mediaId,
          '/users/1/favorites/1',
          'DELETE'
        ),
        data: null,
      };

      favoriteService.remove.mockResolvedValue(successResponse);
      const req: Partial<Request> = {
        url: '/users/1/favorites/1',
        method: 'DELETE',
      };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await controller.remove(userId, mediaId, req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
      expect(res.send).toHaveBeenCalled();
      expect(favoriteService.remove).toHaveBeenCalledWith(
        userId,
        mediaId,
        '/users/1/favorites/1',
        'DELETE'
      );
    });

    it('should handle FavoriteNotFoundError', async () => {
      const userId = 1;
      const mediaId = 1;
      const error = new FavoriteNotFoundError();
      const errorResponse = {
        success: false,
        statusCode: 404,
        error: 'Not Found',
        message: 'Favorito não encontrado',
        code: 'FAVORITE_NOT_FOUND',
        timestamp: expect.any(String),
        path: '/users/1/favorites/1',
        method: 'DELETE',
      };

      favoriteService.remove.mockRejectedValue(error);
      responseMapperFavoriteService.toErrorResponse.mockReturnValue(
        errorResponse
      );
      const req: Partial<Request> = {
        url: '/users/1/favorites/1',
        method: 'DELETE',
      };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.remove(userId, mediaId, req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(errorResponse);
      expect(favoriteService.remove).toHaveBeenCalledWith(
        userId,
        mediaId,
        '/users/1/favorites/1',
        'DELETE'
      );
      expect(
        responseMapperFavoriteService.toErrorResponse
      ).toHaveBeenCalledWith(error, '/users/1/favorites/1', 'DELETE');
    });
  });
});
