import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorites } from '@/domain/entities/favorites/favorite.entity';
import { LoggerModule } from '@/shared/modules/loggers/logger.module';
import { MediaModule } from '@/infrastructure/http/modules/medias/media.module';
import { FavoriteController } from '@/infrastructure/http/controllers/favorites/favorite.controller';
import { FavoriteService } from '@/application/services/favorites/favorite.service';
import { ResponseMapperFavoriteService } from '@/application/services/favorites/response-mapper-favorite.service';
import { TypeormFavoriteRepository } from '@/infrastructure/database/repositories/typeorms/favorites/typeorm-favorite.repository';
import { UserModule } from '@/infrastructure/http/modules/users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorites]),
    LoggerModule,
    forwardRef(() => MediaModule),
    forwardRef(() => UserModule),
  ],
  controllers: [FavoriteController],
  providers: [
    FavoriteService,
    ResponseMapperFavoriteService,
    {
      provide: 'FavoriteRepository',
      useClass: TypeormFavoriteRepository,
    },
  ],
  exports: ['FavoriteRepository'],
})
export class FavoriteModule {}
