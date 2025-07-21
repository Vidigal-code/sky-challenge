import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/infrastructure/database/modules/database.module';
import { MediaModule } from './infrastructure/http/modules/medias/media.module';
import { ConfigModule } from '@nestjs/config';
import { FavoriteModule } from '@/infrastructure/http/modules/favorites/favorite.module';
import { UserModule } from '@/infrastructure/http/modules/users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    MediaModule,
    UserModule,
    FavoriteModule,
  ],
})
export class AppModule {}
