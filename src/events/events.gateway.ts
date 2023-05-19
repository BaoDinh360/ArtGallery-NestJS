import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "dgram";
import { PostService } from "src/posts/post.service";
import { Server } from 'socket.io';
import { Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/common/guards/auth.guard";
import { Request } from "express";
import { CreateCommentDto } from "src/post-comments/dtos/create-comment.dto";
import { PostCommentService } from "src/post-comments/post-comment.service";

@WebSocketGateway({
    cors:{
        origin: '*'
    }
})
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
    constructor(
        private postService: PostService,
        private postCommentService: PostCommentService,
    ){}
    @WebSocketServer() server: Server;
    private connectedUserId: string;
    private connectedClientCounts: number = 0;
    afterInit(server: Server) {
        console.log('Socket instantiated');
    }
    handleConnection(client: any, ...args: any[]) {
        // console.log(`New connection: ${client.id}`);
        this.connectedClientCounts++;
        console.log(this.connectedClientCounts);
        
    }
    handleDisconnect(client: any) {
        // console.log(`Disconnected: ${client.id}`);
        this.connectedClientCounts--;
        console.log(this.connectedClientCounts);
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

    @SubscribeMessage('comment-events')
    async emitNewComment(@MessageBody() createCommentDto: CreateCommentDto){
        const dataEmitted = await this.postCommentService.commentPost(createCommentDto, this.connectedUserId);
        this.server.emit('new-comment', dataEmitted, (err, res) =>{
            if(!err){
                console.log('Client received:', res);
                
            }
        });
    }
}