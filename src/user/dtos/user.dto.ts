export class UserDto{
    _id: string;
    name: string;
    email: string;
    username: string;
    avatar?:UserAvatarDto;
    // password: string;
}

export class UserAvatarDto{
    name: string;
    type: string;
    size: number;
    path: string;
}