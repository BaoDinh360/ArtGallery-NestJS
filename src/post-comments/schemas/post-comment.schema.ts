import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, {  } from "mongoose";
import { Post } from "src/posts/schemas/post.schema";
import { User } from "src/user/schemas/user.schema";



@Schema({timestamps: true})
export class PostComment extends mongoose.Document{
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true})
    userCommented : User;
    
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true})
    postCommented : Post;

    @Prop()
    comment: string;
    
    @Prop({type: Date})
    createdAt? : Date;

    
    @Prop({type: Date})
    updatedAt? : Date;
}

export const PostCommentSchema = SchemaFactory.createForClass(PostComment);