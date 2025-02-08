import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Chat } from '../../chat/entities/chat.entity';  // Assuming you have a Chat entity
import { Friend } from "src/frined/entities/friend.entity";

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

    @Column()
    lastname: string;

    @Column({ type: 'enum', enum: UserRole, nullable: false, default: 'user' })
    role: UserRole;

    @Column({type: 'varchar', length: 255})
    email: string;

    @Column({type: 'varchar', select: false})
    password: string;

    @Column({ default: 0 })
    loginAttempts: number;

    @Column({ type: 'varchar', nullable: true })
    token: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    profilePicture: string;

    @Column({ type: 'text', nullable: true })
    bio: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    pendingEmail: string | null;  // Allow null for pendingEmail

    @Column({ type: 'varchar', length: 6, nullable: true })
    emailVerificationCode: string | null;  // Allow null for emailVerificationCode

    @OneToMany(() => Chat, (chats) => chats.user)
    chat: Chat[];

    @OneToMany(() => Friend, (friend) => friend.sender)
    sentFriendRequests: Friend[];

    @OneToMany(() => Friend, (friend) => friend.receiver)
    receivedFriendRequests: Friend[];


    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
