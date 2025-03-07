import { Controller, Post, Body, UseGuards, Get, Param, Query, InternalServerErrorException } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  sendMessage(@Body() messageDto: { userId: number, message: string, friendId: number }) {
    return this.chatService.sendMessage(messageDto.userId, messageDto.message, messageDto.friendId);
  }

  @Get('history/:friendId')
  async getChatHistory(@Query('userId') userId: string, @Param('friendId') friendId: string) {
    try {
      const history = await this.chatService.getChatHistory(+userId, +friendId);
      return history;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch chat history');
    }
  }
}