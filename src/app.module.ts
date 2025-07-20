import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/infrastructure/database/modules/database.module';
import { MediaModule } from './infrastructure/http/modules/medias/media.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    MediaModule,
  ],
})
export class AppModule {}
