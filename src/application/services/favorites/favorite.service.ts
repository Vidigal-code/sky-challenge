import { Injectable, Inject } from '@nestjs/common';
import { FavoriteRepository } from '@/domain/repositories/favorites/favorite.repository';
import { CreateFavoriteDto } from '@/application/dtos/favorites/create-favorite.dto';
import { Favorites } from '@/domain/entities/favorites/favorite.entity';
import { AppLoggerService } from '@/shared/services/loggers/logger.service';
import { FavoriteMessageSuccess } from '@/shared/responses/favorites/favorite-message-success';
import {
  FavoriteAlreadyExistsError,
  FavoriteNotFoundError,
  FavoriteUnexpectedError,
  FavoriteDomainError,
} from '@/domain/exceptions/favorites/favorite-domain.errors';
import { SuccessResponse } from '@/shared/responses/responses.interface';
import { MediaRepository } from '@/domain/repositories/medias/media.repository';
import { MediaNotFoundError } from '@/domain/exceptions/medias/media-domain.errors';
import { UserRepository } from '@/domain/repositories/users/user.repository';
import { UserNotFoundError } from '@/domain/exceptions/users/user-domain.errors';
import { Medias } from '@/domain/entities/medias/media.entity';

@Injectable()
export class FavoriteService {
  private readonly context = 'FavoriteService';

  constructor(
    @Inject('FavoriteRepository')
    private readonly favoriteRepository: FavoriteRepository,
    @Inject('MediaRepository')
    private readonly mediaRepository: MediaRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly logger: AppLoggerService
  ) {}

  async create(
    userId: number,
    createFavoriteDto: CreateFavoriteDto,
    path: string,
    method: string
  ): Promise<SuccessResponse<null>> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        const error = new UserNotFoundError(userId);
        this.logger.error(
          `Usuário não encontrado para id: ${userId}`,
          error,
          this.context
        );
        throw error;
      }

      const media = await this.mediaRepository.findById(
        createFavoriteDto.mediaId
      );
      if (!media) {
        const error = new MediaNotFoundError(createFavoriteDto.mediaId);
        this.logger.error(
          `Mídia não encontrada para id: ${createFavoriteDto.mediaId}`,
          error,
          this.context
        );
        throw error;
      }

      const existingFavorite =
        await this.favoriteRepository.findByUserIdAndMediaId(
          userId,
          createFavoriteDto.mediaId
        );
      if (existingFavorite) {
        const error = new FavoriteAlreadyExistsError();
        this.logger.error(
          `Favorito já existe para usuário ${userId} e mídia ${createFavoriteDto.mediaId}`,
          error,
          this.context
        );
        throw error;
      }

      const favorite = new Favorites();
      favorite.userId = userId;
      favorite.mediaId = createFavoriteDto.mediaId;

      await this.favoriteRepository.create(favorite);
      this.logger.log(
        `Favorito criado com sucesso para usuário ${userId} e mídia ${createFavoriteDto.mediaId}`,
        this.context
      );
      return {
        ...FavoriteMessageSuccess.created(userId, path, method),
        data: null,
      };
    } catch (error: unknown) {
      this.logger.error(`Erro ao criar favorito`, error, this.context);
      throw error instanceof FavoriteDomainError ||
        error instanceof MediaNotFoundError ||
        error instanceof UserNotFoundError
        ? error
        : new FavoriteUnexpectedError();
    }
  }

  async findAll(
    userId: number,
    path: string,
    method: string
  ): Promise<SuccessResponse<{ medias: Medias[] }>> {
    this.logger.log(`Buscando favoritos para usuário ${userId}`, this.context);
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        const error = new UserNotFoundError(userId);
        this.logger.error(
          `Usuário não encontrado para id: ${userId}`,
          error,
          this.context
        );
        throw error;
      }

      const favorites = await this.favoriteRepository.findAllByUserId(userId);
      const mediaIds = favorites.map((favorite) => favorite.mediaId);
      const medias = await this.mediaRepository.findByIds(mediaIds);

      return {
        ...FavoriteMessageSuccess.retrievedAll(userId, path, method),
        data: { medias },
      };
    } catch (error: unknown) {
      this.logger.error(
        `Erro ao buscar favoritos para usuário ${userId}`,
        error,
        this.context
      );
      throw error instanceof FavoriteDomainError ||
        error instanceof UserNotFoundError
        ? error
        : new FavoriteUnexpectedError();
    }
  }

  async remove(
    userId: number,
    mediaId: number,
    path: string,
    method: string
  ): Promise<SuccessResponse<null>> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        const error = new UserNotFoundError(userId);
        this.logger.error(
          `Usuário não encontrado para id: ${userId}`,
          error,
          this.context
        );
        throw error;
      }

      const favorite = await this.favoriteRepository.findByUserIdAndMediaId(
        userId,
        mediaId
      );
      if (!favorite) {
        const error = new FavoriteNotFoundError();
        this.logger.error(
          `Favorito não encontrado para usuário ${userId} e mídia ${mediaId}`,
          error,
          this.context
        );
        throw error;
      }

      await this.favoriteRepository.remove(favorite);
      this.logger.log(
        `Favorito removido com sucesso para usuário ${userId} e mídia ${mediaId}`,
        this.context
      );
      return {
        ...FavoriteMessageSuccess.removed(userId, mediaId, path, method),
        data: null,
      };
    } catch (error: unknown) {
      this.logger.error(`Erro ao remover favorito`, error, this.context);
      throw error instanceof FavoriteDomainError ||
        error instanceof UserNotFoundError
        ? error
        : new FavoriteUnexpectedError();
    }
  }
}
