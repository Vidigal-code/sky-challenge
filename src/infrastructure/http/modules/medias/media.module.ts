import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaController } from '@/infrastructure/http/controllers/medias/media.controller';
import { MediaService } from '@/application/services/medias/media.service';
import { TypeOrmMediaRepository } from '@/infrastructure/database/repositories/medias/typeorm-media.repository';
import { Medias } from '@/domain/entities/medias/media.entity';
import { ResponseMapperMediaService } from '@/application/services/medias/response-mapper-media.service';
import { LoggerModule } from '@/shared/modules/loggers/logger.module';
import { LangModule } from '@/infrastructure/http/modules/langs/lang.module';

@Module({
  imports: [TypeOrmModule.forFeature([Medias]), LoggerModule, LangModule],
  controllers: [MediaController],
  providers: [
    MediaService,
    ResponseMapperMediaService,
    {
      provide: 'MediaRepository',
      useClass: TypeOrmMediaRepository,
    },
  ],
})
export class MediaModule {}
