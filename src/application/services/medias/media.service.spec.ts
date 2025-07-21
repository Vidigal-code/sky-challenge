import { Test, TestingModule } from '@nestjs/testing';
import { MediaService } from '@/application/services/medias/media.service';
import { MediaRepository } from '@/domain/repositories/medias/media.repository';
import { AppLoggerService } from '@/shared/services/loggers/logger.service';
import { CreateMediaDto } from '@/application/dtos/medias/create-media.dto';
import { Medias } from '@/domain/entities/medias/media.entity';
import {
  MediaNotFoundError,
  MediaInvalidDataError,
  MediaUnexpectedError,
} from '@/domain/exceptions/medias/media-domain.errors';
import { LangRepository } from '@/domain/repositories/langs/lang.repository';
import { Langs } from '@/domain/entities/langs/lang.entity';
import { LangNotFoundError } from '@/domain/exceptions/langs/lang-domain.errors';

describe('MediaService', () => {
  let service: MediaService;
  let mediaRepository: jest.Mocked<MediaRepository>;
  let logger: jest.Mocked<AppLoggerService>;
  let langRepository: jest.Mocked<LangRepository>;

  const loggerMock: jest.Mocked<AppLoggerService> = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        {
          provide: 'MediaRepository',
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            findByTitle: jest.fn(),
            findAllByLang: jest.fn(),
          },
        },
        {
          provide: AppLoggerService,
          useValue: loggerMock,
        },
        {
          provide: 'LangRepository',
          useValue: {
            findByLangCode: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MediaService>(MediaService);
    mediaRepository = module.get('MediaRepository');
    logger = module.get(AppLoggerService);
    langRepository = module.get('LangRepository');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a media successfully', async () => {
      const createMediaDto: CreateMediaDto = {
        title: 'Test Movie',
        description: 'Test Description',
        type: 'movie',
        releaseYear: 2021,
        genre: 'Action',
        genreId: 1,
        langCode: 'en',
      };

      const createdMedia = new Medias();
      Object.assign(createdMedia, createMediaDto);
      createdMedia.id = 1;

      mediaRepository.findByTitle.mockResolvedValue(null);
      mediaRepository.create.mockResolvedValue(createdMedia);
      langRepository.findByLangCode.mockResolvedValue(new Langs());

      const result = await service.create(createMediaDto, '/media', 'POST');

      expect(result.success).toBe(true);
      expect(result.data?.media).toEqual(createdMedia);
      expect(mediaRepository.create).toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalledWith(
        `Mídia criada com sucesso: ${createdMedia.id}`,
        'MediaService'
      );
    });

    it('should throw MediaInvalidDataError when title is missing', async () => {
      const createMediaDto: CreateMediaDto = {
        title: '',
        type: 'movie',
        releaseYear: 2021,
        genre: 'Action',
        genreId: 1,
      };

      await expect(
        service.create(createMediaDto, '/media', 'POST')
      ).rejects.toThrow(MediaInvalidDataError);
      expect(logger.error).toHaveBeenCalledWith(
        'Erro ao criar mídia: dados inválidos',
        expect.any(MediaInvalidDataError),
        'MediaService'
      );
    });

    // Comentado pois a verificação de mídia existente foi desativada
    /*
    it('should throw MediaAlreadyExistsError when media already exists', async () => {
      const createMediaDto: CreateMediaDto = {
        title: 'Existing Movie',
        type: 'movie',
        releaseYear: 2021,
        genre: 'Action',
        genreId: 1,
      };

      const existingMedia = new Medias();
      mediaRepository.findByTitle.mockResolvedValue(existingMedia);

      await expect(
        service.create(createMediaDto, '/media', 'POST')
      ).rejects.toThrow(MediaAlreadyExistsError);
    });
    */
  });

  describe('findAll', () => {
    it('should return all medias', async () => {
      const medias = [new Medias(), new Medias()];
      mediaRepository.findAll.mockResolvedValue(medias);

      const result = await service.findAll('/media', 'GET');

      expect(result.success).toBe(true);
      expect(result.data?.medias).toEqual(medias);
      expect(mediaRepository.findAll).toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalledWith(
        'Buscando todas as mídias',
        'MediaService'
      );
    });

    it('should handle unexpected errors', async () => {
      mediaRepository.findAll.mockRejectedValue(new Error('Database error'));

      await expect(service.findAll('/media', 'GET')).rejects.toThrow(
        MediaUnexpectedError
      );

      expect(logger.error).toHaveBeenCalledWith(
        'Erro ao buscar mídias',
        expect.any(Error),
        'MediaService'
      );
    });
  });

  describe('findOne', () => {
    it('should return a media by id', async () => {
      const media = new Medias();
      media.id = 1;
      mediaRepository.findById.mockResolvedValue(media);

      const result = await service.findOne(1, '/media/1', 'GET');

      expect(result.success).toBe(true);
      expect(result.data?.media).toEqual(media);
      expect(mediaRepository.findById).toHaveBeenCalledWith(1);
      expect(logger.log).toHaveBeenCalledWith(
        'Buscando mídia com id: 1',
        'MediaService'
      );
    });

    it('should throw MediaNotFoundError when media not found', async () => {
      mediaRepository.findById.mockResolvedValue(null);

      await expect(service.findOne(1, '/media/1', 'GET')).rejects.toThrow(
        MediaNotFoundError
      );

      expect(logger.error).toHaveBeenCalledWith(
        `Mídia não encontrada para id: 1`,
        expect.any(MediaNotFoundError),
        'MediaService'
      );
    });
  });

  describe('findAllByLang', () => {
    it('should return medias by language', async () => {
      const medias = [new Medias()];
      const validLang = new Langs();
      validLang.langCode = 'pt';
      langRepository.findByLangCode.mockResolvedValue(validLang);
      mediaRepository.findAllByLang.mockResolvedValue(medias);

      const result = await service.findAllByLang('pt', '/media/lang/pt', 'GET');

      expect(result.success).toBe(true);
      expect(result.data?.medias).toEqual(medias);
      expect(langRepository.findByLangCode).toHaveBeenCalledWith('pt');
      expect(mediaRepository.findAllByLang).toHaveBeenCalledWith('pt');
      expect(logger.log).toHaveBeenCalledWith(
        'Buscando mídias com idioma: pt',
        'MediaService'
      );
    });

    it('should handle unexpected errors', async () => {
      langRepository.findByLangCode.mockRejectedValue(
        new Error('Database connection failed')
      );

      await expect(
        service.findAllByLang('pt', '/media/lang/pt', 'GET')
      ).rejects.toThrow(MediaUnexpectedError);

      expect(logger.error).toHaveBeenCalledWith(
        'Erro ao buscar mídias por idioma pt',
        expect.any(Error),
        'MediaService'
      );
    });

    it('should throw LangNotFoundError when language code is invalid', async () => {
      langRepository.findByLangCode.mockResolvedValue(null);

      await expect(
        service.findAllByLang('invalid', '/media/lang/invalid', 'GET')
      ).rejects.toThrow(LangNotFoundError);

      expect(langRepository.findByLangCode).toHaveBeenCalledWith('invalid');
      expect(logger.error).toHaveBeenCalledWith(
        'LangCode invalid não existe.',
        expect.any(LangNotFoundError),
        'MediaService'
      );
    });
  });
});
