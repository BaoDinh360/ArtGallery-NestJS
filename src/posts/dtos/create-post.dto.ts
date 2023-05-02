export class CreatePostImageDto{
    name: string;
    type : string;
    size : number;
    path : string
}

export class CreatePostDto{
    postName: string;
    description: string;
    postImage:CreatePostImageDto;
    likes: number = 0;
}