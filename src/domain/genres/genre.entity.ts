import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Langs } from '../langs/lang.entity';

@Entity('genres')
export class Genres {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    genreName: string;

    @Column({ length: 5 })
    langCode: string;

    @ManyToOne(() => Langs, { onDelete: 'CASCADE' })
    lang: Langs;
}