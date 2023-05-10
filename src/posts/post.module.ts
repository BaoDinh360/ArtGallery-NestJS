import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Post, PostSchema } from "./schemas/post.schema";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { CommonModule } from "src/common/common.module";
import { UserModule } from "src/user/user.module";
import { PostRepository } from "./post.repository";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Post.name, schema: PostSchema}]),
        CommonModule,
        UserModule,
    ],
    controllers: [PostController],
    providers: [PostService, PostRepository],
    exports: [PostService]
})
export class PostModule{}