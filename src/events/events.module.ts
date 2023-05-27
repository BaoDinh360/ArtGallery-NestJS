import { Module } from "@nestjs/common";
import { EventGateway } from "./events.gateway";
import { PostModule } from "src/posts/post.module";
import { CommonModule } from "src/common/common.module";
import { PostCommentModule } from "src/post-comments/post-comment.module";
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "src/user/user.module";


@Module({
    imports: [PostModule, CommonModule, PostCommentModule, AuthModule, UserModule],
    providers: [EventGateway],
  })
  export class EventsModule {}