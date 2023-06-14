import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CommonModule } from "src/common/common.module";
import { PostComment, PostCommentSchema } from "./schemas/post-comment.schema";
import { PostCommentController } from "./post-comment.controller";
import { PostCommentService } from "./post-comment.service";
import { PostCommentRepository } from "./post-comment.repository";
import { PostModule } from "src/posts/post.module";



@Module({
    imports: [
        MongooseModule.forFeature([
            { name: PostComment.name, schema: PostCommentSchema }]),
        CommonModule,
        // PostModule
    ],
    controllers: [PostCommentController],
    providers: [PostCommentService, PostCommentRepository],
    exports: [PostCommentService]
})
export class PostCommentModule{}