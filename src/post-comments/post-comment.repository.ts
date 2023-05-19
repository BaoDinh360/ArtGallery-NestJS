import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { MongooseRepository } from "src/database/mongoose.repository";
import { PostComment } from "./schemas/post-comment.schema";
import { Model } from "mongoose";


@Injectable()
export class PostCommentRepository extends MongooseRepository<PostComment>{
    constructor(
        @InjectModel(PostComment.name) private postCommentModel : Model<PostComment>,
    ){
        super(postCommentModel);
    }
}