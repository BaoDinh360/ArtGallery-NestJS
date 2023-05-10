import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "dgram";
import { PostService } from "src/posts/post.service";
import { Server } from 'socket.io';
import { Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/common/guards/auth.guard";
import { Request } from "express";

@WebSocketGateway({
    cors:{
        origin: '*'
    }
})
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
    constructor(
        private postService: PostService
    ){}
    @WebSocketServer() server: Server;
    private connectedUserId: string;
    afterInit(server: Server) {
        console.log('Socket instantiated');
    }
    handleConnection(client: any, ...args: any[]) {
        // console.log(`New connection: ${client.id}`);
    }
    handleDisconnect(client: any) {
        // console.log(`Disconnected: ${client.id}`);
    }

    @SubscribeMessage('user-connected')
    getConnectedUserId(@MessageBody() userId: string){
        this.connectedUserId = userId;
        console.log(`New user connection: ${this.connectedUserId}`);
    }
    @SubscribeMessage('user-disconnected')
    deleteDisconnectedUserId(@MessageBody() userId: string){
        this.connectedUserId = undefined;
        console.log(`User disconnected: ${userId}`);
    }

    @SubscribeMessage('like-events')
    async emitLikes(@MessageBody() postId: string, @ConnectedSocket() client: Socket){
        const dataEmitted = await this.postService.likePost(postId, this.connectedUserId);
        // client.emit('like-events', dataEmitted);
        this.server.emit('like-events', dataEmitted);
    }
}