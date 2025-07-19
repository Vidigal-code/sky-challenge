import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Langs } from '../langs/lang.entity';
import { Favorites } from '../favorites/favorite.entity';

@Entity('users')
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'full_name', length: 500 })
    fullName: string;

    @Column({ length: 500, unique: true })
    email: string;

    @Column({ length: 500 })
    password: string;

    @Column({ length: 14, unique: true })
    cpf: string;

    @Column({ length: 20, nullable: true })
    rg: string;

    @Column({ length: 20, nullable: true })
    phone: string;

    @Column({ length: 255, nullable: true })
    street: string;

    @Column({ length: 10, nullable: true })
    number: string;

    @Column({ length: 500, nullable: true })
    complement: string;

    @Column({ length: 500, nullable: true })
    neighborhood: string;

    @Column({ length: 500, nullable: true })
    city: string;

    @Column({ length: 500, nullable: true })
    state: string;

    @Column({ length: 500, nullable: true, name: 'postal_code' })
    postalCode: string;

    @Column({ name: 'lang_code', nullable: true, length: 5 })
    langCode: string;

    @ManyToOne(() => Langs, lang => lang.users, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'lang_code' })
    lang: Langs;

    @Column({ length: 10, default: 'user' })
    role: 'user' | 'admin';

    @Column({ length: 20, default: 'super I' })
    plan: 'super I' | 'super II' | 'top II';

    @Column({ name: 'plan_value', length: 500 })
    planValue: string;

    @Column({ name: 'has_special_needs', length: 500, nullable: true })
    hasSpecialNeeds: string;

    @Column({ name: 'special_needs_description', length: 500, nullable: true })
    specialNeedsDescription: string;

    @Column({ length: 500, nullable: true })
    gender: string;

    @Column({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(() => Favorites, favorite => favorite.user)
    favorites: Favorites[];
}
