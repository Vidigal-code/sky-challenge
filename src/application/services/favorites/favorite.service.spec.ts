import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteService } from '@/application/services/favorites/favorite.service';
import { FavoriteRepository } from '@/domain/repositories/favorites/favorite.repository';
import { MediaRepository } from '@/domain/repositories/medias/media.repository';
import { UserRepository } from '@/domain/repositories/users/user.repository';
import { AppLoggerService } from '@/shared/services/loggers/logger.service';
import { CreateFavoriteDto } from '@/application/dtos/favorites/create-favorite.dto';
import { Favorites } from '@/domain/entities/favorites/favorite.entity';
import { Medias } from '@/domain/entities/medias/media.entity';
import { Users } from '@/domain/entities/users/user.entity';
import {
  FavoriteNotFoundError,
  FavoriteAlreadyExistsError,
} from '@/domain/exceptions/favorites/favorite-domain.errors';
import { MediaNotFoundError } from '@/domain/exceptions/medias/media-domain.errors';
import { UserNotFoundError } from '@/domain/exceptions/users/user-domain.errors';

describe('FavoriteService', () => {
  let service: FavoriteService;
  let favoritesRepository: jest.Mocked<FavoriteRepository>;
  let mediaRepository: jest.Mocked<MediaRepository>;
  let usersRepository: jest.Mocked<UserRepository>;
  let logger: jest.Mocked<AppLoggerService>;

  const loggerMock: jest.Mocked<AppLoggerService> = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoriteService,
        {
          provide: 'FavoriteRepository',
          useValue: {
            create: jest.fn(),
            findAllByUserId: jest.fn(),
            findByUserIdAndMediaId: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: 'MediaRepository',
          useValue: {
            findById: jest.fn(),
            findByIds: jest.fn(),
          },
        },
        {
          provide: 'UserRepository',
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: AppLoggerService,
          useValue: loggerMock,
        },
      ],
    }).compile();

    service = module.get<FavoriteService>(FavoriteService);
    favoritesRepository = module.get('FavoriteRepository');
    mediaRepository = module.get('MediaRepository');
    usersRepository = module.get('UserRepository');
    logger = module.get(AppLoggerService);
  });

  describe('create', () => {
    it('should create a favorite successfully', async () => {
      const createFavoriteDto: CreateFavoriteDto = { mediaId: 1 };
      const userId = 1;
      const favorite = new Favorites();
      favorite.userId = userId;
      favorite.mediaId = createFavoriteDto.mediaId;

      usersRepository.findById.mockResolvedValue(new Users());
      mediaRepository.findById.mockResolvedValue(new Medias());
      favoritesRepository.findByUserIdAndMediaId.mockResolvedValue(null);
      favoritesRepository.create.mockResolvedValue(favorite);

      await service.create(
        userId,
        createFavoriteDto,
        '/users/1/favorites',
        'POST'
      );

      expect(favoritesRepository.create).toHaveBeenCalledWith(
        expect.any(Favorites)
      );
      expect(logger.log).toHaveBeenCalledWith(
        `Favorito criado com sucesso para usuário ${userId} e mídia ${createFavoriteDto.mediaId}`,
        'FavoriteService'
      );
    });

    it('should throw UserNotFoundError when user does not exist', async () => {
      const createFavoriteDto: CreateFavoriteDto = { mediaId: 1 };
      const userId = 1;

      usersRepository.findById.mockResolvedValue(null);

      await expect(
        service.create(userId, createFavoriteDto, '/users/1/favorites', 'POST')
      ).rejects.toThrow(UserNotFoundError);

      expect(logger.error).toHaveBeenCalledWith(
        `Usuário não encontrado para id: ${userId}`,
        expect.any(UserNotFoundError),
        'FavoriteService'
      );
    });

    it('should throw MediaNotFoundError when media does not exist', async () => {
      const createFavoriteDto: CreateFavoriteDto = { mediaId: 1 };
      const userId = 1;

      usersRepository.findById.mockResolvedValue(new Users());
      mediaRepository.findById.mockResolvedValue(null);

      await expect(
        service.create(userId, createFavoriteDto, '/users/1/favorites', 'POST')
      ).rejects.toThrow(MediaNotFoundError);

      expect(logger.error).toHaveBeenCalledWith(
        `Mídia não encontrada para id: ${createFavoriteDto.mediaId}`,
        expect.any(MediaNotFoundError),
        'FavoriteService'
      );
    });

    it('should throw FavoriteAlreadyExistsError when favorite already exists', async () => {
      const createFavoriteDto: CreateFavoriteDto = { mediaId: 1 };
      const userId = 1;
      const existingFavorite = new Favorites();

      usersRepository.findById.mockResolvedValue(new Users());
      mediaRepository.findById.mockResolvedValue(new Medias());
      favoritesRepository.findByUserIdAndMediaId.mockResolvedValue(
        existingFavorite
      );

      await expect(
        service.create(userId, createFavoriteDto, '/users/1/favorites', 'POST')
      ).rejects.toThrow(FavoriteAlreadyExistsError);

      expect(logger.error).toHaveBeenCalledWith(
        `Favorito já existe para usuário ${userId} e mídia ${createFavoriteDto.mediaId}`,
        expect.any(FavoriteAlreadyExistsError),
        'FavoriteService'
      );
    });
  });

  describe('findAll', () => {
    it('should return all favorites for a user', async () => {
      const userId = 1;
      const favorites = [new Favorites()];
      favorites[0].mediaId = 1;
      const medias = [new Medias()];

      usersRepository.findById.mockResolvedValue(new Users());
      favoritesRepository.findAllByUserId.mockResolvedValue(favorites);
      mediaRepository.findByIds.mockResolvedValue(medias);

      const result = await service.findAll(userId, '/users/1/favorites', 'GET');

      expect(result.success).toBe(true);
      expect(result.data?.medias).toEqual(medias);
      expect(favoritesRepository.findAllByUserId).toHaveBeenCalledWith(userId);
      expect(mediaRepository.findByIds).toHaveBeenCalledWith([1]);
      expect(logger.log).toHaveBeenCalledWith(
        `Buscando favoritos para usuário ${userId}`,
        'FavoriteService'
      );
    });

    it('should throw UserNotFoundError when user does not exist', async () => {
      const userId = 1;

      usersRepository.findById.mockResolvedValue(null);

      await expect(
        service.findAll(userId, '/users/1/favorites', 'GET')
      ).rejects.toThrow(UserNotFoundError);

      expect(logger.error).toHaveBeenCalledWith(
        `Usuário não encontrado para id: ${userId}`,
        expect.any(UserNotFoundError),
        'FavoriteService'
      );
    });
  });

  describe('remove', () => {
    it('should remove a favorite successfully', async () => {
      const userId = 1;
      const mediaId = 1;
      const favorite = new Favorites();

      usersRepository.findById.mockResolvedValue(new Users());
      favoritesRepository.findByUserIdAndMediaId.mockResolvedValue(favorite);
      favoritesRepository.remove.mockResolvedValue();

      await service.remove(userId, mediaId, '/users/1/favorites/1', 'DELETE');

      expect(favoritesRepository.remove).toHaveBeenCalledWith(favorite);
      expect(logger.log).toHaveBeenCalledWith(
        `Favorito removido com sucesso para usuário ${userId} e mídia ${mediaId}`,
        'FavoriteService'
      );
    });

    it('should throw UserNotFoundError when user does not exist', async () => {
      const userId = 1;
      const mediaId = 1;

      usersRepository.findById.mockResolvedValue(null);

      await expect(
        service.remove(userId, mediaId, '/users/1/favorites/1', 'DELETE')
      ).rejects.toThrow(UserNotFoundError);

      expect(logger.error).toHaveBeenCalledWith(
        `Usuário não encontrado para id: ${userId}`,
        expect.any(UserNotFoundError),
        'FavoriteService'
      );
    });

    it('should throw FavoriteNotFoundError when favorite does not exist', async () => {
      const userId = 1;
      const mediaId = 1;

      usersRepository.findById.mockResolvedValue(new Users());
      favoritesRepository.findByUserIdAndMediaId.mockResolvedValue(null);

      await expect(
        service.remove(userId, mediaId, '/users/1/favorites/1', 'DELETE')
      ).rejects.toThrow(FavoriteNotFoundError);

      expect(logger.error).toHaveBeenCalledWith(
        `Favorito não encontrado para usuário ${userId} e mídia ${mediaId}`,
        expect.any(FavoriteNotFoundError),
        'FavoriteService'
      );
    });
  });
});
