import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

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
    
    @IsOptional()
    description: string;
    
    @IsOptional()
    postTags: string[];

    @ValidateNested()
    @IsNotEmpty()
    @Type(() => CreatePostImageDto)
    postImage:CreatePostImageDto;
}