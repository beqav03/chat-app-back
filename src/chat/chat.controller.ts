import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  @UseGuards(JwtGuard)  // Protect the endpoint with JWT Guard
  sendMessage(@Body() messageDto: { userId: number, message: string }) {
    return this.chatService.sendMessage(messageDto.userId, messageDto.message);
  }
}
