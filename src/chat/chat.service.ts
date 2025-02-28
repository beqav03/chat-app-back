import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { UserRepository } from 'src/user/user.repository';
import { Logger } from '@nestjs/common';

@Injectable()
export class ChatService {
  private readonly logger = new Logger('ChatService');

  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    private userRepository: UserRepository,
  ) {}

  async sendMessage(userId: number, message: string, friendId: number) {
    try {
      const user = await this.userRepository.findOne(userId);
      if (!user) {
        this.logger.warn(`User not found for ID: ${userId}`);
        return { status: 'User not found' };
      }

      const newMessage = this.chatRepository.create({
        user,
        message,
        friendId,
        timestamp: new Date().toISOString(),
      });

      const savedMessage = await this.chatRepository.save(newMessage);

      return {
        status: 'Message sent',
        message: savedMessage,
      };
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to send message');
    }
  }

  async getChatHistory(userId: number, friendId: number) {
    try {
      const messages = await this.chatRepository
        .createQueryBuilder('chat')
        .leftJoin('chat.user', 'user')
        .where('(user.id = :userId AND chat.friendId = :friendId) OR (user.id = :friendId AND chat.friendId = :userId)', { userId, friendId })
        .orderBy('chat.timestamp', 'ASC')
        .getMany();
  
      if (!messages || messages.length === 0) {
        return [];
      }
  
      return messages;
    } catch (error) {
      this.logger.error(`Error fetching chat history: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch chat history');
    }
  }
}