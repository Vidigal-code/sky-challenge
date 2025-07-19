import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Genres } from '../genres/genre.entity';
import { Users } from '../users/user.entity';
import { Medias } from '../medias/media.entity';

@Entity('langs')
export class Langs {
    @PrimaryColumn({ name: 'lang_code', length: 5 })
    langCode: string;

    @Column({ length: 500 })
    description: string;

    @OneToMany(() => Genres, genre => genre.lang)
    genres: Genres[];

    @OneToMany(() => Users, user => user.lang)
    users: Users[];

    @OneToMany(() => Medias, media => media.lang)
    medias: Medias[];
}
