import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Date } from "mongoose";
import * as mongoose from "mongoose";
import { Image, ImageSchema } from "src/shared/schemas/image.schema";
import { User } from "src/user/schemas/user.schema";

@Schema({timestamps: true})
export class Post extends mongoose.Document{
     
    
    @Prop({required: true, minlength: 2, maxlength: 500})
    postName : string;

    
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true})
    author : User;
    
    
    @Prop()
    description : string;

    
    @Prop({type: ImageSchema, required: true})
    postImage : Image;

    
    @Prop({type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: undefined})
    userLikedPost: User[];

    
    @Prop({type: Date})
    createdAt? : Date;

    
    @Prop({type: Date})
    updatedAt? : Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);

