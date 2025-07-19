import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from '@nestjs/config';
import {Favorites} from "@/domain/favorites/favorite.entity";
import {Users} from "@/domain/users/user.entity";
import {Medias} from "@/domain/medias/media.entity";
import {Langs} from "@/domain/langs/lang.entity";
import {Genres} from "@/domain/genres/genre.entity";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST ?? 'localhost',
            port: parseInt(process.env.POSTGRES_PORT ?? '5432'),
            username: process.env.POSTGRES_USER ?? 'vidigal',
            password: process.env.POSTGRES_PASSWORD ?? 'test1234',
            database: process.env.POSTGRES_DB ?? 'media_db',
            entities: [Favorites, Genres, Langs, Users, Medias],
            synchronize: true,
        }),
    ],
})
export class AppModule {
}