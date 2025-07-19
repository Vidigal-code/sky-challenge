import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Genres } from '../genres/genre.entity';
import { Langs } from '../langs/lang.entity';

@Entity('medias')
export class Medias {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 500 })
    title: string;

    @Column('text')
    description: string;

    @Column({ length: 10 })
    type: 'movie' | 'series';

    @Column()
    releaseYear: number;

    @Column({ length: 255 })
    genre: string;

    @Column()
    genreId: number;

    @ManyToOne(() => Genres, { onDelete: 'CASCADE' })
    genreRef: Genres;

    @Column({ nullable: true })
    langCode: string;

    @ManyToOne(() => Langs, { onDelete: 'SET NULL' })
    lang: Langs;

    @Column('text', { nullable: true })
    imageUrl: string;

    @Column('text', { nullable: true })
    trailerUrl: string;

    @Column({ type: 'date', nullable: true })
    releaseDate: Date;

    @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    isValidType(): boolean {
        return ['movie', 'series'].includes(this.type);
    }

    isValidReleaseYear(): boolean {
        const currentYear = new Date().getFullYear() + 1;
        return this.releaseYear >= 1900 && this.releaseYear <= currentYear;
    }
}