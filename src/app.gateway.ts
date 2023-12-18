import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
  } from '@nestjs/websockets';
  import { Server } from 'socket.io';
  
  @WebSocketGateway()
  export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
  
    handleConnection(client: any, ...args: any[]) {
      console.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: any) {
      console.log(`Client disconnected: ${client.id}`);
    }
  
    @SubscribeMessage('updateProducts')
    handleUpdateProducts(client: any, data: any) {
      this.server.emit('updatedProducts', data);
    }
  
    @SubscribeMessage('updateGraph')
    handleUpdateGraph(client: any, data: any) {
      this.server.emit('updatedGraph', data);
    }
  }
  