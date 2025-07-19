import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Langs } from '../langs/lang.entity';

@Entity('users')
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
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

    @Column({ length: 500, nullable: true })
    postalCode: string;

    @Column({ nullable: true })
    langCode: string;

    @ManyToOne(() => Langs, { onDelete: 'SET NULL' })
    lang: Langs;

    @Column({ length: 10, default: 'user' })
    role: 'user' | 'admin';

    @Column({ length: 20, default: 'super I' })
    plan: 'super I' | 'super II' | 'top II';

    @Column({ length: 500 })
    planValue: string;

    @Column({ length: 500, nullable: true })
    hasSpecialNeeds: string;

    @Column({ length: 500, nullable: true })
    specialNeedsDescription: string;

    @Column({ length: 500, nullable: true })
    gender: string;

    @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}