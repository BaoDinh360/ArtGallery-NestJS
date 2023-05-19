import { Expose, Transform, Type } from "class-transformer";
import { ImageDto } from "src/shared/dtos/image.dto";

export class UserCommentedDto{
    @Expose()
    @Transform((value) => value.obj._id.toString())
    _id: string;
    @Expose()
    username: string;
    @Expose()
    @Type(() => ImageDto)
    avatar: ImageDto; 
}

export class PostCommentDto{
    @Expose()
    @Transform((value) => value.obj._id.toString())
    _id: string;
    @Expose()
    @Type(() => UserCommentedDto)
    userCommented: UserCommentedDto;
    @Expose()
    @Transform((value) => value.obj.postCommented.toString())
    postCommented: string;
    @Expose()
    comment: string;
    @Expose()
    @Type(() => Date)
    createdAt: Date;
}