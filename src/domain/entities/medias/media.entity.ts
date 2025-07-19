import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Genres } from '../genres/genre.entity';
import { Langs } from '../langs/lang.entity';
import { Favorites } from '../favorites/favorite.entity';

@Entity('medias')
export class Medias {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    title: string;

    @Column('text')
    description: string;

    @Column({ length: 10 })
    type: 'movie' | 'series';

    @Column({ name: 'release_year' })
    releaseYear: number;

    @Column()
    genre: string;

    @Column({ name: 'genre_id' })
    genreId: number;

    @ManyToOne(() => Genres, genre => genre.medias, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'genre_id' })
    genreRef: Genres;

    @Column({ name: 'lang_code', nullable: true })
    langCode: string;

    @ManyToOne(() => Langs, lang => lang.medias, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'lang_code' })
    lang: Langs;

    @Column({ name: 'image_url', type: 'text', nullable: true })
    imageUrl: string;

    @Column({ name: 'trailer_url', type: 'text', nullable: true })
    trailerUrl: string;

    @Column({ name: 'release_date', type: 'date', nullable: true })
    releaseDate: Date;

    @Column({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(() => Favorites, favorite => favorite.media)
    favorites: Favorites[];

    isValidType(): boolean {
        return ['movie', 'series'].includes(this.type);
    }

    isValidReleaseYear(): boolean {
        const currentYear = new Date().getFullYear() + 1;
        return this.releaseYear >= 1900 && this.releaseYear <= currentYear;
    }
}
