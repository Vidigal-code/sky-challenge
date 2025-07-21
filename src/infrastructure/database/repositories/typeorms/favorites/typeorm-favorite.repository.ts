import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorites } from '@/domain/entities/favorites/favorite.entity';
import { FavoriteRepository } from '@/domain/repositories/favorites/favorite.repository';

@Injectable()
export class TypeormFavoriteRepository implements FavoriteRepository {
  constructor(
    @InjectRepository(Favorites)
    private readonly ormRepository: Repository<Favorites>
  ) {}

  async create(favorite: Favorites): Promise<Favorites> {
    return this.ormRepository.save(favorite);
  }

  async findAllByUserId(userId: number): Promise<Favorites[]> {
    return this.ormRepository.find({
      where: { userId },
    });
  }

  async findByUserIdAndMediaId(
    userId: number,
    mediaId: number
  ): Promise<Favorites | null> {
    return this.ormRepository.findOneBy({ userId, mediaId });
  }

  async remove(favorite: Favorites): Promise<void> {
    await this.ormRepository.remove(favorite);
  }
}
