import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";

@Schema()
export class Image{
    @Prop()
    name: string;

    @Prop()
    type: string;

    @Prop()
    size: number;

    @Prop({required:true})
    path: string;
}
export const ImageSchema = SchemaFactory.createForClass(Image);