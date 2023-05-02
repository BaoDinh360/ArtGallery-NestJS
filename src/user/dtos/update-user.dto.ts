export class UpdateUserDto{
    name: string;
    username: string;
    avatar?: UpdateUserAvatarDto;
}

export class UpdateUserAvatarDto{
    name: string;
    type: string;
    size: number;
    path: string;
}