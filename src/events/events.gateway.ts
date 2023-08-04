import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "dgram";
import { PostService } from "src/posts/post.service";
import { Server } from 'socket.io';
import { Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/common/guards/auth.guard";
import { Request } from "express";
import { CreateCommentDto } from "src/post-comments/dtos/create-comment.dto";
import { PostCommentService } from "src/post-comments/post-comment.service";
import { SocketGuard } from "src/common/guards/socket/socket.guard";
import { LoggerService } from "src/common/services/utils/logger.service";

@WebSocketGateway({
    cors:{
        origin: 'http://localhost:4200'
    }
})
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
    constructor(
        private postService: PostService,
        private postCommentService: PostCommentService,
        private logService: LoggerService,
    ){}
    @WebSocketServer() server: Server;
    afterInit(server: Server) {
        // console.log('Socket instantiated');
        this.logService.logInfo('Socket instantiated');
    }
    handleConnection(client: any, ...args: any[]) {
        // console.log(`New connection: ${client.id}`);
        this.logService.logInfo(`New connection: ${client.id}`);
    }
    handleDisconnect(client: any) {
        // console.log(`User disconnected: ${client.id}`);
        this.logService.logInfo(`User disconnected: ${client.id}`);
    }

    @UseGuards(SocketGuard)
    @SubscribeMessage('new-like')
    async likePost(@MessageBody() data: any, @ConnectedSocket() client: Socket){
        const postId = data.data;
        const connectedUserId = client['userId'];
        const dataEmitted = await this.postService.likePost(postId, connectedUserId);
        this.server.emit('like-update', dataEmitted);
    }

    @UseGuards(SocketGuard)
    @SubscribeMessage('unlike')
    async unLikePost(@MessageBody() data: any, @ConnectedSocket() client: Socket){
        const postId = data.data;
        const connectedUserId = client['userId'];
        const dataEmitted = await this.postService.unLikePost(postId, connectedUserId);
        this.server.emit('like-update', dataEmitted);
    }

    @UseGuards(SocketGuard)
    @SubscribeMessage('create-comment')
    async commentPost(@MessageBody() data: any, @ConnectedSocket() client: Socket){
        const createCommentDto: CreateCommentDto = data.data;
        const connectedUserId = client['userId'];
        const dataEmitted = await this.postCommentService.commentPost(createCommentDto, connectedUserId);
        //emit new comment to client
        this.server.emit('new-comment', dataEmitted);
        const totalComments = await this.postCommentService.countTotalCommentFromPost(createCommentDto.postCommented);
        //emit new total comments to client
        this.server.emit('update-total-comment', totalComments);
    }
}