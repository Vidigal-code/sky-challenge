import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Langs } from '@/domain/entities/langs/lang.entity';
import { TypeOrmLangRepository } from '@/infrastructure/database/repositories/langs/typeorm-lang.repository';
import { ResponseMapperLangService } from '@/application/services/langs/response-mapper-lang.service';

@Module({
  imports: [TypeOrmModule.forFeature([Langs])],
  providers: [
    {
      provide: 'LangRepository',
      useClass: TypeOrmLangRepository,
    },
    ResponseMapperLangService,
  ],
  exports: ['LangRepository', ResponseMapperLangService],
})
export class LangModule {}
