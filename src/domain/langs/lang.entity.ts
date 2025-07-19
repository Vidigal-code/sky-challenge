import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('langs')
export class Langs {
    @PrimaryColumn({ length: 5 })
    langCode: string;

    @Column({ length: 500 })
    description: string;
}