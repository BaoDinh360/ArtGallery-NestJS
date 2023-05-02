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


@Injectable()
export class PostService{
    constructor(
        @InjectModel(Post.name) private postModel : Model<Post>,
        private userService: UserService
    ){}

    async getAllPosts(queryPage: string, queryLimit: string){
        try {
            const page = Number(queryPage);
            const limit = Number(queryLimit);
            const totalPosts = await this.postModel.find().estimatedDocumentCount();
            const totalPage = Math.ceil(totalPosts/ limit);
            const skip = (page - 1) * limit;
            const posts = await this.postModel.find()
                    .select('-__v')
                    .limit(limit).skip(skip)
                    .populate('author', '_id username avatar')
                    .sort({updatedAt: 'desc'});
            const paginatePostDto : PaginatePostDto<Post> = {
                totalCount: totalPosts,
                itemsPerPage: Number(limit),
                pageIndex : Number(page),
                totalPage : totalPage,
                items: posts
            }
            return paginatePostDto;
        } catch (error) {
            throw error;
        }
    }

    async getPost(id : string){
        try {
            return await this.postModel.findById(id)
                .select('-__v')
                .populate('author', '_id username avatar');
        } catch (error) {
            throw error;
        }
    }

    async getAllPostsByCurrentUser(page : string, limit: string, authorId: string){
        try {
            const totalPosts = await this.postModel.find({author: authorId}).estimatedDocumentCount();
            const totalPage = Math.ceil((totalPosts / Number(limit)));
            const skip = (Number(page) - 1) * Number(limit);
            const posts = await this.postModel.find({author: authorId})
                                .limit(Number(limit)).skip(skip)
                                .select('-__v')
                                .populate('author', '_id username')
                                .sort({updatedAt: 'desc'})
            const paginatePostDto : PaginatePostDto<Post> = {
                totalCount: totalPosts,
                itemsPerPage: Number(limit),
                pageIndex : Number(page),
                totalPage : totalPage,
                items: posts
            }
            return paginatePostDto;
        } catch (error) {
            throw error;
        }
    }

    async createPost(createPostDto : CreatePostDto, authorId : string){
        try {
            const newPost = await this.postModel.create({
                postName: createPostDto.postName,
                author: authorId,
                description: createPostDto.description,
                postImage: createPostDto.postImage,
                likes: createPostDto.likes
            })
            const postDto : PostDto = {
                _id: newPost._id.toString(),
                postName: newPost.postName,
                author: newPost.author,
                description: newPost.description,
                postImage: newPost.postImage,
                likes: newPost.likes,
                createdAt: newPost.createdAt,
                updatedAt: newPost.updatedAt,
            }
            return postDto;
        } catch (error) {
            throw error;
        }
    }
    
    async updatePost(postId: string, updatePostDto: UpdatePostDto, authorId: string){
        try {
            const post = await this.postModel.findById(postId);
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

                const updatedPost = await this.postModel.findByIdAndUpdate(postId, updatePostDto, {new: true});
                const postDto : PostDto = {
                    _id: updatedPost._id.toString(),
                    postName: updatedPost.postName,
                    author: updatedPost.author,
                    description: updatedPost.description,
                    postImage: updatedPost.postImage,
                    likes: updatedPost.likes,
                    createdAt: updatedPost.createdAt,
                    updatedAt: updatedPost.updatedAt,
                }
                return postDto;
            }
        } catch (error) {
            throw error;
        }
    }

    async deletePost(postId: string, authorId: string){
        try {
            const post = await this.postModel.findById(postId);
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
                const deletedPost = await this.postModel.findByIdAndDelete(postId);
                return deletedPost._id;
            }
        } catch (error) {
            throw error;
        }
    }

    async likePost(postId: string){
        try {
            const post = await this.postModel.findById(postId);
            if(!post){
                throw new BadRequestException(`Cannot find post with id : ${postId}`);
            }
            else{
                await this.postModel.findByIdAndUpdate(postId, { $inc:{likes: 1} });
                const postAfterUpdateLike = await this.postModel.findById(postId)
                    .select('_id likes');
                return postAfterUpdateLike;
            }
        } catch (error) {
            throw error;
        }
    }
}