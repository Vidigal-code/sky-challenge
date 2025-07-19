import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Users } from '../users/user.entity';
import { Medias } from '../medias/media.entity';

@Entity('Favorites')
export class Favorites {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @ManyToOne(() => Users, { onDelete: 'CASCADE' })
    user!: Users;

    @Column()
    mediaId: string;

    @ManyToOne(() => Medias, { onDelete: 'CASCADE' })
    media!: Medias;

    @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;
}