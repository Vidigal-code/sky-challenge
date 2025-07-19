import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Langs } from '../langs/lang.entity';
import { Medias } from '../medias/media.entity';

@Entity('genres')
export class Genres {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'genre_name', length: 500 })
    genreName: string;

    @Column({ name: 'lang_code', length: 5 })
    langCode: string;

    @ManyToOne(() => Langs, lang => lang.genres, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'lang_code' })
    lang: Langs;

    @OneToMany(() => Medias, media => media.genreRef)
    medias: Medias[];
}
