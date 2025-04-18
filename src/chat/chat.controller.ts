import { Controller, Post, Body, UseGuards, Get, Param, Query, InternalServerErrorException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

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
  async getChatHistory(@Query('userId') userId: string, @Param('friendId') friendId: string) {
    try {
      const history = await this.chatService.getChatHistory(+userId, +friendId);
      return history;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch chat history');
    }
  }
}