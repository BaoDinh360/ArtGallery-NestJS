import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePostDto } from "./dtos/create-post.dto";
import { Request } from "express";
import { AuthGuard } from "src/common/guards/auth.guard";
import { UpdatePostDto } from "./dtos/update-post.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import {multerOptions } from "src/common/configs/multer.config";
import { PostImageDto } from "./dtos/post.dto";
import { Image } from "src/shared/schemas/image.schema";

@Controller('/api/posts')
export class PostController{
    constructor(
        private postService : PostService
    ){}

    //api/posts
    @Get()
    async getAllPosts(@Query() query){
        return await this.postService.getAllPosts(query.page, query.limit);
    }

    //api/posts/my-posts
    @UseGuards(AuthGuard)
    @Get('my-posts')
    async getAllPostsByCurrentUser(@Query() query, @Req() request: Request){
        return await this.postService.getAllPostsCreateByUser(query.page, query.limit, request['user']['_id']);
    }

    //api/posts/:id
    @Get(':id')
    async getPost(@Param('id') id : string){
        return await this.postService.getPost(id);
    }

    //api/posts
    @UseGuards(AuthGuard)
    @Post()
    async createPost(@Body() createPostDto : CreatePostDto, @Req() request: Request){
        return await this.postService.createPost(createPostDto, request['user']['_id']);
    }

    //api/posts/:id
    @UseGuards(AuthGuard)
    @Put(':id')
    async updatePost(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @Req() request: Request){
        return await this.postService.updatePost(id, updatePostDto, request['user']['_id']);
    }

    //api/posts/:id
    @UseGuards(AuthGuard)
    @Delete(':id')
    async deletePost(@Param('id') id: string, @Req() request: Request){
        return await this.postService.deletePost(id, request['user']['_id']);
    }

    //api/posts/upload
    @UseGuards(AuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('image', multerOptions))
    uploadFile(@UploadedFile() file : Express.Multer.File, @Req() request: Request): Image{
        const fullImgUrl = `${request.protocol}://${request.get('Host')}/${file.path}`;
        return {
            name: file.filename,
            type : file.filename.split('.')[1],
            size : file.size,
            path : fullImgUrl
        }
    }
}