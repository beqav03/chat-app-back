import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    GUEST = 'guest'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'enum', enum: UserRole, nullable: false, default: 'user' })
    role: UserRole;

    @Column({type: 'varchar', length: 255})
    email: string;

    @Column({type: 'varchar', select: false})
    password: string;

    @Column({ default: 0 })
    loginAttempts: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
