import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";

export class UpdateUserAvatarDto{
    name: string;
    type: string;
    size: number;
    
    @IsNotEmpty()
    path: string;
}

export class UpdateUserDto{
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    username: string;

    @ValidateNested()
    @Type(() => UpdateUserAvatarDto)
    avatar: UpdateUserAvatarDto;
}

