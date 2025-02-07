import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    private userRepository: UserRepository, 
  ) {}

  async sendMessage(userId: number, message: string) {
    const user = await this.userRepository.findOne(userId);
    if (user) {
      const newMessage = this.chatRepository.create({ user, message });
      await this.chatRepository.save(newMessage);
      return { status: 'Message sent' };
    }
    return { status: 'User not found' };
  }
}
