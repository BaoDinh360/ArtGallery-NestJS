import { Controller, Get, Param } from "@nestjs/common";
import { PostCommentService } from "./post-comment.service";

@Controller('api/posts/:id/comments')
export class PostCommentController{
    constructor(
        private postCommentService: PostCommentService,
    ){}

    //api/posts/:id/comments
    @Get()
    getCommentsFromPost(@Param('id') id: string){
        return this.postCommentService.getCommentsFromPost(id);
    }

}