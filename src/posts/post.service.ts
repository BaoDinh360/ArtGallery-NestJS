import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Post } from "./schemas/post.schema";
import { Model } from "mongoose";
import { CreatePostDto } from "./dtos/create-post.dto";
import { PostDto } from "./dtos/post.dto";
import { UpdatePostDto } from "./dtos/update-post.dto";
import { UserService } from "src/user/user.service";
import * as mongoose from "mongoose";
import { PaginatePostDto } from "./dtos/paginate-post.dto";
import { PostRepository } from "./post.repository";
import { classToPlain, instanceToPlain, plainToClass, plainToInstance, serialize } from "class-transformer";
import { LikePostDto } from "./dtos/like-post.dto";


@Injectable()
export class PostService{
    constructor(
        @InjectModel(Post.name) private postModel : Model<Post>,
        private userService: UserService,
        private postRepository: PostRepository,
    ){}

    async getAllPosts(queryPage: string, queryLimit: string){
        try {
            const totalPosts = await this.postRepository.coundDocumentWithCondition();
            let page = Number(queryPage);
            let limit = Number(queryLimit);
            let skip = 0;
            if(Number.isNaN(page) || Number.isNaN(limit)){
                page = 0;
                limit = totalPosts;
                console.log(limit, totalPosts);
            }
            else {
                skip = (page - 1) * limit;
            } 
            
            const totalPage = Math.ceil(totalPosts/ limit); 
            const posts = await this.postRepository.getAllPosts(skip, limit);
            // console.log(posts);
            
            const postDtos = plainToInstance(PostDto, posts, {excludeExtraneousValues:true});
            
            const paginatePostDto : PaginatePostDto<PostDto> = {
                totalCount: totalPosts,
                itemsPerPage: Number(limit),
                pageIndex : Number(page),
                totalPage : totalPage,
                items: postDtos
            }
            return paginatePostDto;
        } catch (error) {
            throw error;
        }
    }

    async getPost(id : string){
        try {
            const post = await this.postRepository.getPostById(id);
            const postDto = plainToInstance(PostDto, post, {excludeExtraneousValues: true});
            return postDto;
        } catch (error) {
            throw error;
        }
    }

    async getAllPostsCreateByUser(queryPage : string, queryLimit: string, authorId: string){
        console.log(queryPage, queryLimit);
        
        try {
            const totalPosts = await this.postRepository.coundDocumentWithCondition({
                author: authorId
            });
            let page = Number(queryPage);
            let limit = Number(queryLimit);
            let skip = 0;
            if(Number.isNaN(page) || Number.isNaN(limit)){
                page = 0;
                limit = totalPosts;
                console.log(limit, totalPosts);
            }
            else {
                skip = (page - 1) * limit;
            }
            
            const totalPage = Math.ceil((totalPosts / Number(limit)));
            console.log(limit, skip);
            console.log(typeof limit, typeof skip);
            const posts = await this.postRepository.getPostsByAuthor(skip, limit, authorId);
            const postDtos = plainToInstance(PostDto, posts, {excludeExtraneousValues:true});
            const paginatePostDto : PaginatePostDto<PostDto> = {
                totalCount: totalPosts,
                itemsPerPage: Number(limit),
                pageIndex : Number(page),
                totalPage : totalPage,
                items: postDtos
            }
            return paginatePostDto;
        } catch (error) {
            throw error;
        }
    }

    async createPost(createPostDto : CreatePostDto, authorId : string): Promise<string>{
        try {
            const postData = {
                postName: createPostDto.postName,
                author: authorId,
                description: createPostDto.description,
                postImage: createPostDto.postImage
            }
            const newPost = await this.postRepository.insertOne(postData);
            return newPost._id;
        } catch (error) {
            throw error;
        }
    }
    
    async updatePost(postId: string, updatePostDto: UpdatePostDto, authorId: string): Promise<string>{
        try {
            //const post = await this.postModel.findById(postId);
            const post = await this.postRepository.findByIdWithCondition(postId);
            if(!post){
                throw new BadRequestException(`Cannot find post with id : ${postId}`);
            }
            else{
                const author = await this.userService.findUserById(authorId);
                if(!author){
                    throw new BadRequestException('Cannot found user created this post');
                }
                if(post.author.toString() !== author['_id'].toString()){
                    throw new ForbiddenException('This user is not authorized to edit this post');
                }

                //const updatedPost = await this.postModel.findByIdAndUpdate(postId, updatePostDto, {new: true});
                const updatedPost = await this.postRepository.findByIdAndUpdateOne(postId, updatePostDto);
                return updatedPost._id;
            }
        } catch (error) {
            throw error;
        }
    }

    async deletePost(postId: string, authorId: string){
        try {
            //const post = await this.postModel.findById(postId);
            const post = await this.postRepository.findByIdWithCondition(postId);
            if(!post){
                throw new BadRequestException(`Cannot find post with id : ${postId}`);
            }
            else{
                const author = await this.userService.findUserById(authorId);
                if(!author){
                    throw new BadRequestException('Cannot found user created this post');
                }
                if(post.author.toString() !== author['_id'].toString()){
                    throw new ForbiddenException('This user is not authorized to delete this post');
                }
                const isPostDeleted = await this.postRepository.findByIdAndDeleteOne(postId);
                return isPostDeleted;
            }
        } catch (error) {
            throw error;
        }
    }

    async likePost(postId: string, userId: string): Promise<LikePostDto>{
        try {
            const post = await this.postRepository.findByIdWithCondition(postId);
            if(!post){
                throw new BadRequestException(`Cannot find post with id : ${postId}`);
            }
            else{
                await this.postRepository.findByIdAndUpdateOne(postId, { $push: {userLikedPost : userId}}, {'timestamps': false});
                const updatedPost = await this.postRepository.findByIdWithCondition(postId)
                return { 
                    id: postId,
                    likes: updatedPost.userLikedPost.length
                };
                
            }
        } catch (error) {
            throw error;
        }
    }
}