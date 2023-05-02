import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId, SchemaTypes } from "mongoose";


@Schema({timestamps: true})
export class AuthSession{
    @Prop({type: SchemaTypes.ObjectId})
    userId: ObjectId;

    @Prop({required: true})
    refreshToken: string
}

export const AuthSessionSchema = SchemaFactory.createForClass(AuthSession);