import { Date } from "mongoose";
import { User } from "src/user/schemas/user.schema";

export class PostImageDto{
    name: string;
    type : string;
    size : number;
    path : string
}

export class PostDto{
    _id: string;
    postName: string;
    author: User;
    description: string;
    postImage: PostImageDto;
    likes: number;
    createdAt: Date;
    updatedAt: Date;
}