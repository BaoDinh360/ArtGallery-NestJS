import { Module } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { EventGateway } from '../events/events.gateway';
import { PostService } from 'src/posts/post.service';
import { PostModule } from 'src/posts/post.module';
import { SocketGuard } from './guards/socket/socket.guard';
import { LoggingMiddleware } from './middleware/logging/logging.middleware';
import { LoggerService } from './services/utils/logger.service';

@Module({
    providers: [AuthGuard, JwtService, SocketGuard, LoggingMiddleware, LoggerService],
    exports: [AuthGuard, JwtService, SocketGuard, LoggingMiddleware, LoggerService]
})
export class CommonModule {}
