import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class ChatRepository {
  private readonly logger = new Logger('ChatRepository');

  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
  ) {}

  async saveMessage(chat: Chat): Promise<Chat> {
    try {
      return await this.chatRepository.save(chat);
    } catch (error) {
      this.logger.error(`Error saving message: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to save message');
    }
  }

  async getChatHistory(userId: number, friendId: number): Promise<Chat[]> {
    try {
      const messages = await this.chatRepository
        .createQueryBuilder('chat')
        .leftJoinAndSelect('chat.user', 'user')
        .where('(chat.user = :userId AND chat.friendId = :friendId) OR (chat.user = :friendId AND chat.friendId = :userId)', 
          { userId, friendId }
        )
        .orderBy('chat.timestamp', 'ASC')
        .getMany();

      return messages;
    } catch (error) {
      this.logger.error(`Error fetching chat history: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch chat history');
    }
  }

  createMessage(user: any, message: string, friendId: number): Chat {
    return this.chatRepository.create({
      user,
      message,
      friendId,
      timestamp: new Date().toISOString(),
    });
  }
}