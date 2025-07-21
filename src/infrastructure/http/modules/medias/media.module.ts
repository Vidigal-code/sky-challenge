import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medias } from '@/domain/entities/medias/media.entity';
import { MediaController } from '@/infrastructure/http/controllers/medias/media.controller';
import { MediaService } from '@/application/services/medias/media.service';
import { ResponseMapperMediaService } from '@/application/services/medias/response-mapper-media.service';
import { LoggerModule } from '@/shared/modules/loggers/logger.module';
import { LangModule } from '@/infrastructure/http/modules/langs/lang.module';
import { FavoriteModule } from '@/infrastructure/http/modules/favorites/favorite.module';
import { TypeOrmMediaRepository } from '@/infrastructure/database/repositories/typeorms/medias/typeorm-media.repository';
import { MediaDomainExceptionFilter } from '@/infrastructure/filters/medias/media-domain-exception.filter';
import { LangDomainExceptionFilter } from '@/infrastructure/filters/langs/lang-domain-exception.filter';

@Module({
  imports: [
    TypeOrmModule.forFeature([Medias]),
    LoggerModule,
    LangModule,
    forwardRef(() => FavoriteModule),
  ],
  controllers: [MediaController],
  providers: [
    MediaService,
    ResponseMapperMediaService,
    LangDomainExceptionFilter,
    MediaDomainExceptionFilter,
    {
      provide: 'MediaRepository',
      useClass: TypeOrmMediaRepository,
    },
  ],
  exports: ['MediaRepository'],
})
export class MediaModule {}
