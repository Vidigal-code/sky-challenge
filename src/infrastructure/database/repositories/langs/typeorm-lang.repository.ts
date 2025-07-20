import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Langs } from '@/domain/entities/langs/lang.entity';
import { LangRepository } from '@/domain/repositories/langs/lang.repository';

@Injectable()
export class TypeOrmLangRepository implements LangRepository {
  constructor(
    @InjectRepository(Langs)
    private readonly ormRepository: Repository<Langs>
  ) {}

  async findByLangCode(langCode: string): Promise<Langs | null> {
    return this.ormRepository.findOneBy({ langCode });
  }

  async findAll(): Promise<Langs[]> {
    return this.ormRepository.find();
  }

  async create(lang: Langs): Promise<Langs> {
    return this.ormRepository.save(lang);
  }
}
