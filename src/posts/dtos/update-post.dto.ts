import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdatePostDto{
    @IsNotEmpty()
    postName: string;
    @IsOptional()
    description: string;

    @IsOptional()
    postTags: string[];

    // postImage:CreatePostImageDto
}