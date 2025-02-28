import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { ChatGateway } from './chat.gateway';
import { Logger } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatService {
  private readonly logger = new Logger('ChatService');

  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly userRepository: UserRepository,
    private readonly chatGateway: ChatGateway,
  ) {}

  async sendMessage(userId: number, message: string, friendId: number): Promise<{ status: string; message: Chat }> {
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const friend = await this.userRepository.findOne(friendId);
    if (!friend) {
      throw new NotFoundException(`Friend with ID ${friendId} not found`);
    }

    const newMessage = this.chatRepository.createMessage(user, message, friendId);
    const savedMessage = await this.chatRepository.saveMessage(newMessage);

    this.chatGateway.server.to(`user_${userId}`).to(`user_${friendId}`).emit('message', {
      id: savedMessage.id,
      userId,
      friendId,
      message,
      timestamp: savedMessage.timestamp,
    });

    return { status: 'Message sent', message: savedMessage };
  }

  async getChatHistory(userId: number, friendId: number): Promise<any[]> {
    const messages = await this.chatRepository.getChatHistory(userId, friendId);
    
    return messages.map(msg => ({
      id: msg.id,
      userId: msg.user.id,
      friendId: msg.friendId,
      message: msg.message,
      timestamp: msg.timestamp
    }));
  }
}