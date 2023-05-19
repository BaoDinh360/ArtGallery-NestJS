import { Exclude, Expose, Transform, Type } from "class-transformer";
import mongoose, { Date } from "mongoose";
import { User } from "src/user/schemas/user.schema";

export class PostImageDto{
    //path
    @Expose()
    path: string;
}

// export class AuthorDto{
//     //id
//     @Expose({name: 'id'})
//     _id: string;
//     //username
//     @Expose()
//     username: string;
//     //avatar
//     @Expose()
//     @Type(() => PostImageDto)
//     avatar: PostImageDto;
// }
export class AuthorDto{
    //id
    @Expose()
    @Transform((value) => value.obj._id.toString())
    _id: string;
    //username
    @Expose()
    username: string;
    //avatar
    @Expose()
    @Type(() => PostImageDto)
    avatar: PostImageDto;
}
// export class PostDto{
//     //id
//     @Expose({name: 'id'})
//     _id: string;
//     //postName
//     @Expose()
//     postName: string;
//     //author
//     @Expose()
//     @Type(() => AuthorDto)
//     author: AuthorDto;
//     //description
//     @Expose()
//     description: string;
//     //postImage
//     @Expose()
//     @Type(() => PostImageDto)
//     postImage: PostImageDto;
//     //userLikedPost
//     @Expose()
//     @Type(() => String)
//     userLikedPost: string[];
//     //likes
//     @Expose()
//     get likes(): number{
//         if(this.userLikedPost){
//             return this.userLikedPost.length;
//         }
//         else return 0;
        
//     }
//     //createdAt
//     @Expose()
//     @Type(() => Date)
//     createdAt: Date;
//     //updatedAt
//     @Expose()
//     @Type(() => Date)
//     updatedAt: Date;
// }
export class PostDto{
    //id
    @Expose()
    @Transform((value) => value.obj._id.toString())
    _id: string;
    //postName
    @Expose()
    postName: string;
    //author
    @Expose()
    @Type(() => AuthorDto)
    author: AuthorDto;
    //description
    @Expose()
    description: string;
    //postImage
    @Expose()
    // @Type(() => PostImageDto)
    postImage: string;
    //userLikedPost
    @Expose()
    @Type(() => String)
    userLikedPost: string[];
    @Expose()
    likeCount: number;
    @Expose()
    commentCount: number;
    //createdAt
    @Expose()
    @Type(() => Date)
    createdAt: Date;
    //updatedAt
    @Expose()
    @Type(() => Date)
    updatedAt: Date;
}