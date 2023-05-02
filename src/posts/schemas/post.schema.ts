import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Date } from "mongoose";
import * as mongoose from "mongoose";
import { Image, ImageSchema } from "src/shared/schemas/image.schema";
import { User } from "src/user/schemas/user.schema";

// @Schema()
// export class PostImage{
//     @Prop({required:true})
//     name: string;

//     @Prop({required:true})
//     type: string;

//     @Prop({required:true})
//     size: number;

//     @Prop({required:true})
//     path: string;
// }
// export const PostImageSchema = SchemaFactory.createForClass(PostImage);

@Schema({timestamps: true})
export class Post{
    @Prop({required: true})
    postName : string;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    author : User;

    @Prop()
    description : string;

    @Prop({type: ImageSchema, required: true})
    postImage : Image;

    @Prop()
    likes : number;

    @Prop({type: Date})
    createdAt? : Date;

    @Prop({type: Date})
    updatedAt? : Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);

