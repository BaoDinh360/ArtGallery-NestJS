import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Post } from "./schemas/post.schema";
import { MongooseRepository } from "src/database/mongoose.repository";

@Injectable()
export class PostRepository extends MongooseRepository<Post>{
    constructor(
        @InjectModel(Post.name) private postModel : Model<Post>,
    ){
        super(postModel);
    }
}