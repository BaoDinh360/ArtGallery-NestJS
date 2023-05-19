import { Expose, Transform, Type } from "class-transformer";

export class UserAvatarDto{
    //path
    @Expose()
    path: string;
}

export class UserDto{
    //id
    @Expose()
    @Transform((value) => value.obj._id.toString())
    _id: string;
    //name
    @Expose()
    name: string;
    //email
    @Expose()
    email: string;
    //username
    @Expose()
    username: string;
    //avatar
    @Expose()
    @Type(() => UserAvatarDto)
    avatar:UserAvatarDto;
}

