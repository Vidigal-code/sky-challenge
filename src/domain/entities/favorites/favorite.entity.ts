import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from '../users/user.entity';
import { Medias } from '../medias/media.entity';

@Entity('favorites')
export class Favorites {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => Users, (user) => user.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column({ name: 'media_id' })
  mediaId: number;

  @ManyToOne(() => Medias, (media) => media.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'media_id' })
  media: Medias;

  @Column({
    name: 'created_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
