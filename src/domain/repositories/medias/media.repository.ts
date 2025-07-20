import { Medias } from '@/domain/entities/medias/media.entity';

export abstract class MediaRepository {
  abstract create(media: Medias): Promise<Medias>;

  abstract findAll(): Promise<Medias[]>;

  abstract findById(id: number): Promise<Medias | null>;

  abstract findAllByLang(langCode: string): Promise<Medias[]>;

  abstract findByTitle(title: string): Promise<Medias | null>;
}
