import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medias } from '@/domain/entities/medias/media.entity';
import { MediaRepository } from '@/domain/repositories/medias/media.repository';

@Injectable()
export class TypeOrmMediaRepository implements MediaRepository {
  constructor(
    @InjectRepository(Medias)
    private readonly ormRepository: Repository<Medias>
  ) {}

  async create(media: Medias): Promise<Medias> {
    return this.ormRepository.save(media);
  }

  async findAll(): Promise<Medias[]> {
    return this.ormRepository.find();
  }

  async findById(id: number): Promise<Medias | null> {
    return this.ormRepository.findOneBy({ id });
  }

  async findAllByLang(lang: string): Promise<Medias[]> {
    return this.ormRepository.find({
      where: { langCode: lang },
    });
  }

  async findByTitle(title: string): Promise<Medias | null> {
    return this.ormRepository.findOneBy({ title });
  }
}
