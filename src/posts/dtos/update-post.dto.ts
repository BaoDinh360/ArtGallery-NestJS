import { IsNotEmpty } from "class-validator";

export class UpdatePostDto{
    @IsNotEmpty()
    postName: string;
    description: string;
    // postImage:CreatePostImageDto
}