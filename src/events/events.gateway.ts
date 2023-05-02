import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "dgram";
import { PostService } from "src/posts/post.service";
import { Server } from 'socket.io';

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
    afterInit(server: Server) {
        console.log('Socket instantiated');
    }
    handleConnection(client: any, ...args: any[]) {
        console.log(`New connection: ${client.id}`);
    }
    handleDisconnect(client: any) {
        console.log(`Disconnected: ${client.id}`);
    }

    @SubscribeMessage('like-events')
    async emitLikes(@MessageBody() postId: string, @ConnectedSocket() client: Socket){
        console.log(postId);
        const dataEmitted = await this.postService.likePost(postId);
        client.emit('like-events', dataEmitted);
    }
}