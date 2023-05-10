import { Expose, Type } from "class-transformer";

export class UserAvatarDto{
    @Expose()
    path: string;
}

export class UserDto{
    @Expose({name: 'id'})
    _id: string;

    @Expose()
    name: string;
    
    @Expose()
    email: string;
    
    @Expose()
    username: string;
    
    @Expose({groups: ['update']})
    @Type(() => UserAvatarDto)
    avatar:UserAvatarDto;
}

