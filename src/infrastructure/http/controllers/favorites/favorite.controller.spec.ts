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
import { Request, Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { FavoriteController } from '@/infrastructure/http/controllers/favorites/favorite.controller';
import { FavoriteService } from '@/application/services/favorites/favorite.service';
import { ResponseMapperFavoriteService } from '@/application/services/favorites/response-mapper-favorite.service';

const mockRequest = (url: string, method: string): Partial<Request> => ({
  url,
  method,
});

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('FavoriteController', () => {
  let controller: FavoriteController;
  let favoriteService: jest.Mocked<FavoriteService>;

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
        { provide: ResponseMapperFavoriteService, useValue: {} },
      ],
    }).compile();

    controller = module.get<FavoriteController>(FavoriteController);
    favoriteService = module.get(FavoriteService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a favorite and return no content', async () => {
      const createFavoriteDto: CreateFavoriteDto = { mediaId: 1 };
      const userId = 1;
      const successResponse = {
        ...FavoriteMessageSuccess.created(
          userId,
          `/users/${userId}/favorites`,
          'POST'
        ),
        data: null,
      };
      favoriteService.remove.mockResolvedValue(successResponse);

      const req = mockRequest(`/users/${userId}/favorites`, 'POST');
      const res = mockResponse();

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
        req.url,
        req.method
      );
    });

    it('should throw MediaNotFoundError', async () => {
      const createFavoriteDto: CreateFavoriteDto = { mediaId: 999 };
      const userId = 1;
      const error = new MediaNotFoundError(999);
      favoriteService.create.mockRejectedValue(error);

      const req = mockRequest(`/users/${userId}/favorites`, 'POST');
      const res = mockResponse();

      await expect(
        controller.create(
          userId,
          createFavoriteDto,
          req as Request,
          res as Response
        )
      ).rejects.toThrow(error);
    });

    it('should throw FavoriteAlreadyExistsError', async () => {
      const createFavoriteDto: CreateFavoriteDto = { mediaId: 1 };
      const userId = 1;
      const error = new FavoriteAlreadyExistsError();
      favoriteService.create.mockRejectedValue(error);

      const req = mockRequest(`/users/${userId}/favorites`, 'POST');
      const res = mockResponse();

      await expect(
        controller.create(
          userId,
          createFavoriteDto,
          req as Request,
          res as Response
        )
      ).rejects.toThrow(error);
    });
  });

  describe('findAll', () => {
    it('should return all favorites for a user', async () => {
      const userId = 1;
      const medias = [new Medias()];
      const successResponse = {
        ...FavoriteMessageSuccess.retrievedAll(
          userId,
          `/users/${userId}/favorites`,
          'GET'
        ),
        data: { medias },
      };
      favoriteService.findAll.mockResolvedValue(successResponse);

      const req = mockRequest(`/users/${userId}/favorites`, 'GET');
      const res = mockResponse();

      await controller.findAll(userId, req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(successResponse);
    });

    it('should throw UserNotFoundError', async () => {
      const userId = 999;
      const error = new UserNotFoundError(userId);
      favoriteService.findAll.mockRejectedValue(error);

      const req = mockRequest(`/users/${userId}/favorites`, 'GET');
      const res = mockResponse();

      await expect(
        controller.findAll(userId, req as Request, res as Response)
      ).rejects.toThrow(error);
    });
  });

  describe('remove', () => {
    it('should remove a favorite and return no content', async () => {
      const userId = 1;
      const mediaId = 1;
      const successResponse = {
        ...FavoriteMessageSuccess.created(
          userId,
          `/users/${userId}/favorites/${mediaId}`,
          'POST'
        ),
        data: null,
      };
      favoriteService.remove.mockResolvedValue(successResponse);

      const req = mockRequest(
        `/users/${userId}/favorites/${mediaId}`,
        'DELETE'
      );
      const res = mockResponse();

      await controller.remove(userId, mediaId, req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
      expect(res.send).toHaveBeenCalled();
      expect(favoriteService.remove).toHaveBeenCalledWith(
        userId,
        mediaId,
        req.url,
        req.method
      );
    });

    it('should throw FavoriteNotFoundError', async () => {
      const userId = 1;
      const mediaId = 999;
      const error = new FavoriteNotFoundError();
      favoriteService.remove.mockRejectedValue(error);

      const req = mockRequest(
        `/users/${userId}/favorites/${mediaId}`,
        'DELETE'
      );
      const res = mockResponse();

      await expect(
        controller.remove(userId, mediaId, req as Request, res as Response)
      ).rejects.toThrow(error);
    });
  });
});
