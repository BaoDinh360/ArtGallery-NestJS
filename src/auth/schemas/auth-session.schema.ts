import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId, SchemaTypes } from "mongoose";


@Schema({timestamps: true})
export class AuthSession{
    @Prop({required: true})
    sessionId: string;
    @Prop({type: SchemaTypes.ObjectId, required: true})
    userId: ObjectId;

    @Prop({required: true})
    refreshToken: string
}

export const AuthSessionSchema = SchemaFactory.createForClass(AuthSession);