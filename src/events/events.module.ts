import { Module } from "@nestjs/common";
import { EventGateway } from "./events.gateway";
import { PostModule } from "src/posts/post.module";
import { CommonModule } from "src/common/common.module";


@Module({
    imports: [PostModule, CommonModule],
    providers: [EventGateway],
  })
  export class EventsModule {}