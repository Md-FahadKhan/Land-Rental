// src/chat/chat.gateway.ts
import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Message } from '../module/message.entity';
  
  @WebSocketGateway()
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
  
    constructor(
      @InjectRepository(Message)
      private messageRepository: Repository<Message>,
    ) {}
  
    async handleConnection(client: Socket): Promise<void> {
      // Fetch and send all existing messages to the connecting client
      const messages = await this.messageRepository.find();
      client.emit('message', messages);
    }
  
    handleDisconnect(): void {
      // Handle disconnection if needed
    }
  
    
  }
  