import { Test, TestingModule } from '@nestjs/testing';
import { MediaController } from '@/infrastructure/http/controllers/medias/media.controller';
import { MediaService } from '@/application/services/medias/media.service';
import { MediaMessageSuccess } from '@/shared/responses/medias/media-message-success';
import { MediaNotFoundError } from '@/domain/exceptions/medias/media-domain.errors';
import { Medias } from '@/domain/entities/medias/media.entity';
import { CreateMediaDto } from '@/application/dtos/medias/create-media.dto';
import { Request, Response } from 'express';
import { ResponseMapperMediaService } from '@/application/services/medias/response-mapper-media.service';
import { ResponseMapperLangService } from '@/application/services/langs/response-mapper-lang.service';
import { LangNotFoundError } from '@/domain/exceptions/langs/lang-domain.errors';

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

describe('MediaController', () => {
  let controller: MediaController;
  let mediaService: jest.Mocked<MediaService>;

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
        { provide: ResponseMapperMediaService, useValue: {} },
        { provide: ResponseMapperLangService, useValue: {} },
      ],
    }).compile();

    controller = module.get<MediaController>(MediaController);
    mediaService = module.get(MediaService);
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
      const req = mockRequest('/media', 'POST');
      const res = mockResponse();

      await controller.create(createMediaDto, req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(successResponse);
      expect(mediaService.create).toHaveBeenCalledWith(
        createMediaDto,
        '/media',
        'POST'
      );
    });

    it('should throw an error if service rejects', async () => {
      const createMediaDto: CreateMediaDto = {
        title: 'Guerreiros do Asfalto',
        type: 'movie',
        releaseYear: 2021,
        genre: 'Ação',
        genreId: 2,
      };
      const error = new Error('Erro inesperado');
      mediaService.create.mockRejectedValue(error);

      const req = mockRequest('/media', 'POST');
      const res = mockResponse();

      await expect(
        controller.create(createMediaDto, req as Request, res as Response)
      ).rejects.toThrow(error);
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

      const req = mockRequest('/media', 'GET');
      const res = mockResponse();

      await controller.findAll(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(successResponse);
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

      const req = mockRequest('/media/1', 'GET');
      const res = mockResponse();

      await controller.findOne(1, req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(successResponse);
      expect(mediaService.findOne).toHaveBeenCalledWith(1, '/media/1', 'GET');
    });

    it('should throw MediaNotFoundError if media not found', async () => {
      const error = new MediaNotFoundError(1);
      mediaService.findOne.mockRejectedValue(error);

      const req = mockRequest('/media/1', 'GET');
      const res = mockResponse();

      await expect(
        controller.findOne(1, req as Request, res as Response)
      ).rejects.toThrow(error);
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

      const req = mockRequest('/media/lang/pt', 'GET');
      const res = mockResponse();

      await controller.findByLang('pt', req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(successResponse);
    });

    it('should throw LangNotFoundError if language not found', async () => {
      const error = new LangNotFoundError(
        "Idioma com código 'sr' não encontrado"
      );
      mediaService.findAllByLang.mockRejectedValue(error);

      const req = mockRequest('/media/lang/sr', 'GET');
      const res = mockResponse();

      await expect(
        controller.findByLang('sr', req as Request, res as Response)
      ).rejects.toThrow(error);
    });
  });
});
