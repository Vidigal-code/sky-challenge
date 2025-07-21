import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '@/domain/entities/users/user.entity';
import { LoggerModule } from '@/shared/modules/loggers/logger.module';
import { FavoriteModule } from '@/infrastructure/http/modules/favorites/favorite.module';
import { TypeormUserRepository } from '@/infrastructure/database/repositories/typeorms/users/typeorm-user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    LoggerModule,
    forwardRef(() => FavoriteModule),
  ],
  providers: [
    {
      provide: 'UserRepository',
      useClass: TypeormUserRepository,
    },
  ],
  exports: ['UserRepository'],
})
export class UserModule {}
