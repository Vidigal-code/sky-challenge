import { Langs } from '@/domain/entities/langs/lang.entity';

export abstract class LangRepository {
  abstract findByLangCode(langCode: string): Promise<Langs | null>;

  abstract findAll(): Promise<Langs[]>;

  abstract create(lang: Langs): Promise<Langs>;
}
