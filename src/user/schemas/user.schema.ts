import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Mongoose, ObjectId, SchemaTypes } from "mongoose";
import { ImageSchema, Image } from "src/shared/schemas/image.schema";

@Schema({timestamps: true})
export class User{
    @Prop({type: SchemaTypes.ObjectId})
    _id: ObjectId;

    @Prop({required:true})
    name: string;

    @Prop({required:true})
    email: string;

    @Prop({required:true})
    username: string;

    @Prop({required:true})
    password: string;

    @Prop({type: ImageSchema, required: true})
    avatar : Image;
}

export const UserSchema = SchemaFactory.createForClass(User);