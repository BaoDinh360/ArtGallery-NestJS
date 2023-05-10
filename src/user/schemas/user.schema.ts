import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Mongoose, ObjectId, SchemaTypes } from "mongoose";
import { ImageSchema, Image } from "src/shared/schemas/image.schema";

@Schema({timestamps: true})
export class User extends Document{
    
    @Prop({required:true, minlength:2, maxlength:50})
    name: string;
    
    @Prop({
        required:true, 
        unique:true,
        match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    })
    email: string;
    
    @Prop({required:true, unique: true})
    username: string;
    
    @Prop({required:true})
    password: string;

    @Prop({type: ImageSchema, default: {
        path: 'https://material.angular.io/assets/img/examples/shiba1.jpg'
    }})
    avatar : Image;
}

export const UserSchema = SchemaFactory.createForClass(User);