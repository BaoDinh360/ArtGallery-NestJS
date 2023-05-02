import { Body, Controller, Get, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { Request } from "express";
import { AuthGuard } from "src/common/guards/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "src/common/configs/multer.config";
import { UserAvatarDto } from "./dtos/user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";

@Controller('/api/users')
export class UserController{
    constructor(
        private userService: UserService
    ){}

    //api/users/profile
    @UseGuards(AuthGuard)
    @Get('profile')
    async getUserProfile(@Req() request : Request){
        return await this.userService.getUserProfile(request['user']['_id']);
    }

    //api/users/upload
    @UseGuards(AuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('avatar', multerOptions))
    uploadFile(@UploadedFile() file : Express.Multer.File) : UserAvatarDto{
        return {
            name: file.filename,
            type : file.filename.split('.')[1],
            size : file.size,
            path : file.path
        }
    } 

    //api/users/update
    @UseGuards(AuthGuard)
    @Put('update')
    async updateCurrentUserInfo(@Body() updateUserDto: UpdateUserDto, @Req() request: Request){
        return await this.userService.updateCurrentUser(updateUserDto, request['user']['_id']);
    }
}