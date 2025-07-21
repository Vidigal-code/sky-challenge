import { Injectable, Inject } from '@nestjs/common';
import { MediaRepository } from '@/domain/repositories/medias/media.repository';
import { CreateMediaDto } from '@/application/dtos/medias/create-media.dto';
import { Medias } from '@/domain/entities/medias/media.entity';
import { AppLoggerService } from '@/shared/services/loggers/logger.service';
import { MediaMessageSuccess } from '@/shared/responses/medias/media-message-success';
import {
  MediaNotFoundError,
  MediaInvalidDataError,
  MediaUnexpectedError,
  MediaDomainError,
} from '@/domain/exceptions/medias/media-domain.errors';
import { SuccessResponse } from '@/shared/responses/responses.interface';
import { LangRepository } from '@/domain/repositories/langs/lang.repository';
import {
  LangDomainError,
  LangNotFoundError,
} from '@/domain/exceptions/langs/lang-domain.errors';

@Injectable()
export class MediaService {
  private readonly context = 'MediaService';

  constructor(
    @Inject('MediaRepository')
    private readonly mediaRepository: MediaRepository,
    @Inject('LangRepository')
    private readonly langRepository: LangRepository,
    private readonly logger: AppLoggerService
  ) {}

  async create(
    createMediaDto: CreateMediaDto,
    path: string,
    method: string
  ): Promise<SuccessResponse<{ media: Medias }>> {
    try {
      if (!createMediaDto.title || !createMediaDto.type) {
        const error = new MediaInvalidDataError();
        this.logger.error(
          'Erro ao criar mídia: dados inválidos',
          error,
          this.context
        );
        throw error;
      }
      /*const existingMedia = await this.mediaRepository.findByTitle(
        createMediaDto.title
      );
      if (existingMedia) {
        throw new MediaAlreadyExistsError();
      }*/
      const newMedia = new Medias();
      Object.assign(newMedia, createMediaDto);
      const created = await this.mediaRepository.create(newMedia);
      this.logger.log(`Mídia criada com sucesso: ${created.id}`, this.context);
      return {
        ...MediaMessageSuccess.created(created.id, path, method),
        data: { media: created },
      };
    } catch (error: unknown) {
      this.logger.error('Erro ao criar mídia', error, this.context);
      throw error instanceof MediaDomainError
        ? error
        : new MediaUnexpectedError();
    }
  }

  async findAll(
    path: string,
    method: string
  ): Promise<SuccessResponse<{ medias: Medias[] }>> {
    this.logger.log('Buscando todas as mídias', this.context);
    try {
      const medias = await this.mediaRepository.findAll();
      return {
        ...MediaMessageSuccess.retrievedAll(path, method),
        data: { medias },
      };
    } catch (error: unknown) {
      this.logger.error('Erro ao buscar mídias', error, this.context);
      throw error instanceof MediaDomainError
        ? error
        : new MediaUnexpectedError();
    }
  }

  async findOne(
    id: number,
    path: string,
    method: string
  ): Promise<SuccessResponse<{ media: Medias }>> {
    this.logger.log(`Buscando mídia com id: ${id}`, this.context);
    try {
      const media = await this.mediaRepository.findById(id);
      if (!media) {
        const error = new MediaNotFoundError(id);
        this.logger.error(
          `Mídia não encontrada para id: ${id}`,
          error,
          this.context
        );
        throw error;
      }
      return {
        ...MediaMessageSuccess.retrievedOne(id, path, method),
        data: { media },
      };
    } catch (error: unknown) {
      this.logger.error(
        `Erro ao buscar mídia com id: ${id}`,
        error,
        this.context
      );
      throw error instanceof MediaDomainError
        ? error
        : new MediaUnexpectedError();
    }
  }

  async findAllByLang(
    langCode: string,
    path: string,
    method: string
  ): Promise<SuccessResponse<{ medias: Medias[] }>> {
    this.logger.log(`Buscando mídias com idioma: ${langCode}`, this.context);
    try {
      const lang = await this.langRepository.findByLangCode(langCode);
      if (!lang) {
        const langError = new LangNotFoundError(langCode);
        this.logger.error(
          `LangCode ${langCode} não existe.`,
          langError,
          this.context
        );
        throw langError;
      }

      const medias = await this.mediaRepository.findAllByLang(langCode);
      return {
        ...MediaMessageSuccess.retrievedByLang(langCode, path, method),
        data: { medias },
      };
    } catch (error: unknown) {
      this.logger.error(
        `Erro ao buscar mídias por idioma ${langCode}`,
        error,
        this.context
      );
      if (
        error instanceof MediaDomainError ||
        error instanceof LangDomainError
      ) {
        throw error;
      }

      throw new MediaUnexpectedError();
    }
  }
}
