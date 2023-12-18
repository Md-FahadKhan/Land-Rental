// src/chat/chat.controller.ts
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../module/message.entity';
import { Controller } from '@nestjs/common';

@Controller()
@WebSocketGateway()
export class ChatController {
  @WebSocketServer() server;

  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}
  async handleMessage(@MessageBody() content: string): Promise<void> {
    const message = await this.messageRepository.create({ content });
    console.log('Received message:', content);
    console.log('Created message:', message);
    await this.messageRepository.save(message);
    this.server.emit('message', message);
  }
  
}
