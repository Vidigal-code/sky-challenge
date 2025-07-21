import { Favorites } from '@/domain/entities/favorites/favorite.entity';

export abstract class FavoriteRepository {
  abstract create(favorite: Favorites): Promise<Favorites>;

  abstract findAllByUserId(userId: number): Promise<Favorites[]>;

  abstract findByUserIdAndMediaId(
    userId: number,
    mediaId: number
  ): Promise<Favorites | null>;

  abstract remove(favorite: Favorites): Promise<void>;
}
