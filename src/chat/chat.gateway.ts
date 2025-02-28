import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');

  constructor(private jwtService: JwtService) {}

  afterInit() {
    this.logger.log('WebSocket initialized');
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    try {
      const decoded = this.jwtService.verify(token);
      client.join(`user_${decoded.userId}`);
      this.logger.log(`Client connected: ${client.id} - User: ${decoded.userId}`);
    } catch (error) {
      this.logger.warn(`Unauthorized connection attempt: ${client.id}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}