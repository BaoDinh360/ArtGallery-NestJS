import { IsNotEmpty } from "class-validator";

export class CreateCommentDto{
    @IsNotEmpty()
    postCommented: string;

    @IsNotEmpty()
    userCommented: string;

    @IsNotEmpty()
    comment: string;
}