import { Module } from "@nestjs/common";
import { EventGateway } from "./events.gateway";
import { PostModule } from "src/posts/post.module";


@Module({
    imports: [PostModule],
    providers: [EventGateway],
  })
  export class EventsModule {}