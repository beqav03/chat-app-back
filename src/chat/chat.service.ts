import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { UserRepository } from 'src/user/user.repository';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    private userRepository: UserRepository,
    private chatGateway: ChatGateway,
  ) {}

  async sendMessage(userId: number, message: string, friendId: number) {
    const user = await this.userRepository.findOne(userId);
    if (!user) return { status: 'User not found' };

    const newMessage = this.chatRepository.create({ 
      user, 
      message,
      friendId,
      timestamp: new Date().toISOString(),
    });
    const savedMessage = await this.chatRepository.save(newMessage);

    this.chatGateway.server.emit('message', {
      userId,
      friendId,
      message,
      timestamp: savedMessage.timestamp,
    });

    return { status: 'Message sent', message: savedMessage };
  }

  async getChatHistory(userId: number, friendId: number) {
    const messages = await this.chatRepository
      .createQueryBuilder('chat')
      .where('(chat.userId = :userId AND chat.friendId = :friendId) OR (chat.userId = :friendId AND chat.friendId = :userId)', { userId, friendId })
      .orderBy('chat.timestamp', 'ASC')
      .getMany();
    return messages;
  }
}