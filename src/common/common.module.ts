import { Module } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { EventGateway } from '../events/events.gateway';
import { PostService } from 'src/posts/post.service';
import { PostModule } from 'src/posts/post.module';

@Module({
    providers: [AuthGuard, JwtService],
    exports: [AuthGuard, JwtService]
})
export class CommonModule {}
