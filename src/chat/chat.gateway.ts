import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');

  constructor(
    private jwtService: JwtService,
    private chatService: ChatService,
  ) {}

  afterInit() {
    this.logger.log('WebSocket initialized');
  }

  handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    try {
      this.jwtService.verify(token);
      this.logger.log(`Client connected: ${client.id}`);
    } catch (error) {
      this.logger.warn(`Unauthorized connection attempt: ${client.id}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Handle the "message" event from the client
  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() payload: any,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Received message: ${payload.message}`);

    try {
      const { userId, message, friendId } = payload;
      const result = await this.chatService.sendMessage(userId, message, friendId);

      if (result.status === 'Message sent' && result.message) {
        this.server.emit('message', {
          userId,
          friendId,
          message,
          timestamp: result.message.timestamp,
        });

        this.logger.log(`Message broadcasted to clients`);
      } else {
        this.logger.warn(`Failed to save message: ${result.status}`);
      }
    } catch (error) {
      this.logger.error(`Error handling message: ${error.message}`);
    }
  }
}