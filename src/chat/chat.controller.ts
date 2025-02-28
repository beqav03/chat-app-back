import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  @UseGuards(JwtGuard)
  sendMessage(@Body() messageDto: { userId: number, message: string, friendId: number }) {
    return this.chatService.sendMessage(messageDto.userId, messageDto.message, messageDto.friendId);
  }

  @Get('history/:friendId')
  @UseGuards(JwtGuard)
  getChatHistory(@Param('friendId') friendId: string, @Body() body: { userId: number }) {
    return this.chatService.getChatHistory(body.userId, +friendId);
  }
}