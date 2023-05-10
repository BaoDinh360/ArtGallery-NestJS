import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

export class CreatePostImageDto{
    name: string;
    type : string;
    @IsNumber()
    size : number;

    @IsNotEmpty()
    path : string
}

export class CreatePostDto{
    @IsNotEmpty()
    postName: string;
    
    @IsString()
    description: string;
    
    @ValidateNested()
    @IsNotEmpty()
    @Type(() => CreatePostImageDto)
    postImage:CreatePostImageDto;
}