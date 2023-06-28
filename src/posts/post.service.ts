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
import { PostCommentService } from "src/post-comments/post-comment.service";
import { PostSearchDto } from "./dtos/post-search.dto";


@Injectable()
export class PostService{
    constructor(
        @InjectModel(Post.name) private postModel : Model<Post>,
        private userService: UserService,
        private postRepository: PostRepository,
        private postCommentService: PostCommentService,
    ){}

    async getAllPosts(postSearchDto: PostSearchDto){
        try {
            const totalPosts = await this.postRepository.coundDocumentWithCondition();
            // let page = Number(queryPage);
            // let limit = Number(queryLimit);
            // let skip = 0;
            // if(Number.isNaN(page) || Number.isNaN(limit)){
            //     page = 0;
            //     limit = totalPosts;
            //     console.log(limit, totalPosts);
            // }
            // else {
            //     skip = (page - 1) * limit;
            // } 

            const authorId = await this.userService.findUserByUsername(postSearchDto.authorName);
            if(authorId){
                postSearchDto.authorId = authorId.id;
            }

            const totalPage = Math.ceil(totalPosts/ postSearchDto.limit); 
            const posts = await this.postRepository.getAllPosts(postSearchDto);
            const postDtos = plainToInstance(PostDto, posts, {excludeExtraneousValues:true});
            
            const paginatePostDto : PaginatePostDto<PostDto> = {
                totalCount: totalPosts,
                itemsPerPage: postSearchDto.limit,
                pageIndex : postSearchDto.page,
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

    async getAllPostsCreateByUser(postSearchDto: PostSearchDto){
        try {
            const totalPosts = await this.postRepository.coundDocumentWithCondition({
                author: postSearchDto.authorId
            });
            // let page = Number(queryPage);
            // let limit = Number(queryLimit);
            // let skip = 0;
            // if(Number.isNaN(page) || Number.isNaN(limit)){
            //     page = 0;
            //     limit = totalPosts;
            //     console.log(limit, totalPosts);
            // }
            // else {
            //     skip = (page - 1) * limit;
            // }
            
            const totalPage = Math.ceil((totalPosts / postSearchDto.limit));
            const posts = await this.postRepository.getPostsByAuthor(postSearchDto);
            const postDtos = plainToInstance(PostDto, posts, {excludeExtraneousValues:true});
            const paginatePostDto : PaginatePostDto<PostDto> = {
                totalCount: totalPosts,
                itemsPerPage: postSearchDto.limit,
                pageIndex : postSearchDto.page,
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
            // const postData = {
            //     postName: createPostDto.postName,
            //     author: authorId,
            //     description: createPostDto.description,
            //     postImage: createPostDto.postImage,
            // }
            const postData = {
                ...createPostDto,
                author: authorId
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
                //delete all comment from this post(if any)
                await this.postCommentService.deleteAllPostComments(postId);
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
                    type: 'like',
                    id: postId,
                    likes: updatedPost.userLikedPost.length,
                    userId: userId
                };
            }
        } catch (error) {
            throw error;
        }
    }
    
    async unLikePost(postId: string, userId: string): Promise<LikePostDto>{
        try {
            const post = await this.postRepository.findByIdWithCondition(postId);
            if(!post){
                throw new BadRequestException(`Cannot find post with id : ${postId}`);
            }
            else{
                await this.postRepository.findByIdAndUpdateOne(postId, { $pull: {userLikedPost : userId}}, {'timestamps': false});
                const updatedPost = await this.postRepository.findByIdWithCondition(postId);
                return{
                    type: 'unlike',
                    id: postId,
                    likes: updatedPost.userLikedPost.length,
                    userId: userId
                }
            }
        } catch (error) {
            throw error;
        }
    }
}