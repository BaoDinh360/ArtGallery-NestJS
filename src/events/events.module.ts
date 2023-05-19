import { Module } from "@nestjs/common";
import { EventGateway } from "./events.gateway";
import { PostModule } from "src/posts/post.module";
import { CommonModule } from "src/common/common.module";
import { PostCommentModule } from "src/post-comments/post-comment.module";


@Module({
    imports: [PostModule, CommonModule, PostCommentModule],
    providers: [EventGateway],
  })
  export class EventsModule {}