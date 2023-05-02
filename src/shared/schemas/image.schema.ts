import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";

@Schema()
export class Image{
    @Prop({required:true})
    name: string;

    @Prop({required:true})
    type: string;

    @Prop({required:true})
    size: number;

    @Prop({required:true})
    path: string;
}
export const ImageSchema = SchemaFactory.createForClass(Image);