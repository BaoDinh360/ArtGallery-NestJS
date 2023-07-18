import { Body, Controller, Get, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { Request } from "express";
import { AuthGuard } from "src/common/guards/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "src/common/configs/multer.config";
import { UserAvatarDto } from "./dtos/user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { Image } from "src/shared/schemas/image.schema";

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
    async uploadAvatar(@UploadedFile() file : Express.Multer.File, @Req() request: Request){
        const fullImgUrl = `${request.protocol}://${request.get('Host')}/${file.path}`;
        const userAvatar : Image ={
            name: file.filename,
            type : file.filename.split('.')[1],
            size : file.size,
            path : fullImgUrl
        }
        const userId = request['user']['_id'];
        const userDto = await this.userService.getUserProfile(userId);
        const updateUserDto: UpdateUserDto ={
            name: userDto.name,
            username: userDto.username,
            avatar: userAvatar
        }
        return await this.userService.updateCurrentUser(updateUserDto, userId);
        // return {
        //     name: file.filename,
        //     type : file.filename.split('.')[1],
        //     size : file.size,
        //     path : fullImgUrl
        // }
    } 

    //api/users/update
    @UseGuards(AuthGuard)
    @Put('update')
    async updateCurrentUserInfo(@Body() updateUserDto: UpdateUserDto, @Req() request: Request){
        return await this.userService.updateCurrentUser(updateUserDto, request['user']['_id']);
    }

    //api/users/update
    // @UseGuards(AuthGuard)
    // @Post('update')
    // @UseInterceptors(FileInterceptor('avatar', multerOptions))
    // async updateCurrentUserInfo(@UploadedFile() file : Express.Multer.File, @Req() request: Request,
    //     @Body() updateUserDto: UpdateUserDto){
        
    //     if(file){
    //         const fullImgUrl = `${request.protocol}://${request.get('Host')}/${file.path}`;
    //         const fileDto : FileDto ={
    //             name: file.filename,
    //             type: file.filename.split('.')[1],
    //             size: file.size,
    //             path: fullImgUrl
    //         }
    //         updateUserDto.avatar = fileDto;
    //     }

    //     return this.userService.updateCurrentUser(updateUserDto, request['user']['_id']);
    // }

}