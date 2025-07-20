import { Test, TestingModule } from '@nestjs/testing';
import { MediaController } from '@/infrastructure/http/controllers/medias/media.controller';
import { MediaService } from '@/application/services/medias/media.service';
import { MediaMessageSuccess } from '@/shared/responses/medias/media-message-success';
import {
  MediaNotFoundError,
  MediaAlreadyExistsError,
} from '@/domain/exceptions/medias/media-domain.errors';
import { Medias } from '@/domain/entities/medias/media.entity';
import { CreateMediaDto } from '@/application/dtos/medias/create-media.dto';
import { Request } from 'express';
import { Response } from 'express';
import { ResponseMapperMediaService } from '@/application/services/medias/response-mapper-media.service';
import { ResponseMapperLangService } from '@/application/services/langs/response-mapper-lang.service';
import { LangNotFoundError } from '@/domain/exceptions/langs/lang-domain.errors';

describe('MediaController', () => {
  let controller: MediaController;
  let mediaService: jest.Mocked<MediaService>;
  let responseMapperMediaService: jest.Mocked<ResponseMapperMediaService>;
  let responseMapperLangService: jest.Mocked<ResponseMapperLangService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaController],
      providers: [
        {
          provide: MediaService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            findAllByLang: jest.fn(),
          },
        },
        {
          provide: ResponseMapperMediaService,
          useValue: {
            toErrorResponse: jest.fn(),
          },
        },
        {
          provide: ResponseMapperLangService,
          useValue: {
            toErrorResponse: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MediaController>(MediaController);
    mediaService = module.get(MediaService);
    responseMapperMediaService = module.get(ResponseMapperMediaService);
    responseMapperLangService = module.get(ResponseMapperLangService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a media', async () => {
      const createMediaDto: CreateMediaDto = {
        title: 'Guerreiros do Asfalto',
        description: 'Perseguições em alta velocidade em São Paulo.',
        type: 'movie',
        releaseYear: 2021,
        genre: 'Ação',
        genreId: 2,
        langCode: 'pt',
        imageUrl: 'https://example.com/images/guerreiros_asfalto.jpg',
        trailerUrl: 'https://example.com/trailers/guerreiros_asfalto.mp4',
        releaseDate: '2021-09-10',
      };

      const created = new Medias();
      created.id = 1;
      created.title = 'Guerreiros do Asfalto';
      created.type = 'movie';
      created.releaseYear = 2021;
      created.genre = 'Ação';
      created.genreId = 2;
      created.langCode = 'pt';
      created.imageUrl = 'https://example.com/images/guerreiros_asfalto.jpg';
      created.trailerUrl =
        'https://example.com/trailers/guerreiros_asfalto.mp4';
      created.releaseDate = createMediaDto.releaseDate
        ? new Date(createMediaDto.releaseDate)
        : null;

      const successResponse = {
        ...MediaMessageSuccess.created(1, '/media', 'POST'),
        data: { media: created },
      };

      mediaService.create.mockResolvedValue(successResponse);
      const req: Partial<Request> = { url: '/media', method: 'POST' };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.create(createMediaDto, req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(successResponse);
      expect(mediaService.create).toHaveBeenCalledWith(
        createMediaDto,
        '/media',
        'POST'
      );
    });

    it('should handle MediaAlreadyExistsError', async () => {
      const createMediaDto: CreateMediaDto = {
        title: 'Guerreiros do Asfalto',
        type: 'movie',
        releaseYear: 2021,
        genre: 'Ação',
        genreId: 2,
      };

      const error = new MediaAlreadyExistsError();
      const errorResponse = {
        success: false,
        statusCode: 409,
        error: 'Conflict',
        message: 'Mídia já existe',
        code: 'MEDIA_ALREADY_EXISTS',
        timestamp: expect.any(String),
        path: '/media',
        method: 'POST',
      };

      mediaService.create.mockRejectedValue(error);
      responseMapperMediaService.toErrorResponse.mockReturnValue(errorResponse);
      const req: Partial<Request> = { url: '/media', method: 'POST' };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.create(createMediaDto, req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(errorResponse);
      expect(mediaService.create).toHaveBeenCalledWith(
        createMediaDto,
        '/media',
        'POST'
      );
      expect(responseMapperMediaService.toErrorResponse).toHaveBeenCalledWith(
        error,
        '/media',
        'POST'
      );
    });
  });

  describe('findAll', () => {
    it('should return all medias', async () => {
      const medias = [new Medias()];
      const successResponse = {
        ...MediaMessageSuccess.retrievedAll('/media', 'GET'),
        data: { medias },
      };

      mediaService.findAll.mockResolvedValue(successResponse);
      const req: Partial<Request> = { url: '/media', method: 'GET' };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.findAll(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(successResponse);
      expect(mediaService.findAll).toHaveBeenCalledWith('/media', 'GET');
    });
  });

  describe('findOne', () => {
    it('should return a media by id', async () => {
      const media = new Medias();
      media.id = 1;

      const successResponse = {
        ...MediaMessageSuccess.retrievedOne(1, '/media/1', 'GET'),
        data: { media },
      };

      mediaService.findOne.mockResolvedValue(successResponse);
      const req: Partial<Request> = { url: '/media/1', method: 'GET' };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.findOne(1, req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(successResponse);
      expect(mediaService.findOne).toHaveBeenCalledWith(1, '/media/1', 'GET');
    });

    it('should handle MediaNotFoundError', async () => {
      const error = new MediaNotFoundError(1);
      const errorResponse = {
        success: false,
        statusCode: 404,
        error: 'Not Found',
        message: 'Mídia com ID 1 não encontrada',
        code: 'MEDIA_NOT_FOUND',
        timestamp: expect.any(String),
        path: '/media/1',
        method: 'GET',
      };

      mediaService.findOne.mockRejectedValue(error);
      responseMapperMediaService.toErrorResponse.mockReturnValue(errorResponse);
      const req: Partial<Request> = { url: '/media/1', method: 'GET' };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.findOne(1, req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(errorResponse);
      expect(mediaService.findOne).toHaveBeenCalledWith(1, '/media/1', 'GET');
      expect(responseMapperMediaService.toErrorResponse).toHaveBeenCalledWith(
        error,
        '/media/1',
        'GET'
      );
    });
  });

  describe('findByLang', () => {
    it('should return medias by language', async () => {
      const medias = [new Medias()];
      const successResponse = {
        ...MediaMessageSuccess.retrievedByLang('pt', '/media/lang/pt', 'GET'),
        data: { medias },
      };

      mediaService.findAllByLang.mockResolvedValue(successResponse);
      const req: Partial<Request> = { url: '/media/lang/pt', method: 'GET' };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.findByLang('pt', req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(successResponse);
      expect(mediaService.findAllByLang).toHaveBeenCalledWith(
        'pt',
        '/media/lang/pt',
        'GET'
      );
    });

    it('should handle LangNotFoundError', async () => {
      const error = new LangNotFoundError(
        "Idioma com código 'sr' não encontrado"
      );
      const errorResponse = {
        success: false,
        statusCode: 404,
        error: 'Not Found',
        message: "Idioma com código 'sr' não encontrado",
        code: 'LANG_NOT_FOUND',
        timestamp: expect.any(String),
        path: '/media/lang/sr',
        method: 'GET',
      };

      mediaService.findAllByLang.mockRejectedValue(error);
      responseMapperLangService.toErrorResponse.mockReturnValue(errorResponse);
      const req: Partial<Request> = { url: '/media/lang/sr', method: 'GET' };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.findByLang('sr', req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(errorResponse);
      expect(mediaService.findAllByLang).toHaveBeenCalledWith(
        'sr',
        '/media/lang/sr',
        'GET'
      );
      expect(responseMapperLangService.toErrorResponse).toHaveBeenCalledWith(
        error,
        '/media/lang/sr',
        'GET'
      );
    });
  });
});
