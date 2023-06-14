import { BadRequestException, Injectable } from "@nestjs/common";
import { PostCommentRepository } from "./post-comment.repository";
import { PostRepository } from "src/posts/post.repository";
import { CreateCommentDto } from "./dtos/create-comment.dto";
import { plainToInstance } from "class-transformer";
import { PostCommentDto } from "./dtos/post-comment.dto";


@Injectable()
export class PostCommentService{
    constructor(
        private postCommentRepository: PostCommentRepository,
        // private postRepository: PostRepository,
    ){}

    async getCommentsFromPost(postId: string){
        try {
            const postComments = await this.postCommentRepository.findByCondition(
                {postCommented: postId},
                {updatedAt: 0},
                {
                    populate: {path: 'userCommented', select: '_id username avatar'}
                }
            )
            const postCommentDtos = plainToInstance(PostCommentDto, postComments, {excludeExtraneousValues:true});
            return postCommentDtos;
        } catch (error) {
            throw error
        }
    }

    async countTotalCommentFromPost(postId: string){
        try {
            const totalComments = await this.postCommentRepository.coundDocumentWithCondition(
                {postCommented: postId}
            )
            return {
                postId: postId,
                totalComments: totalComments
            };
        } catch (error) {
            throw error;
        }
    }

    async commentPost(createCommentDto: CreateCommentDto, userId: string){
        try {
            const postId = createCommentDto.postCommented;
            // const post = await this.postRepository.findByIdWithCondition(postId);
            // if(!post){
            //     throw new BadRequestException(`Cannot find post with id : ${postId}`);
            // }
            // else{
            //     createCommentDto.userCommented = userId;
            //     const newComment = await this.postCommentRepository.insertOne(createCommentDto, {path: 'userCommented', select: '_id username avatar'});
            //     const postCommentDto = plainToInstance(PostCommentDto, newComment, {excludeExtraneousValues:true});
            //     return postCommentDto;
            // }
            createCommentDto.userCommented = userId;
            const newComment = await this.postCommentRepository.insertOne(createCommentDto, {path: 'userCommented', select: '_id username avatar'});
            const postCommentDto = plainToInstance(PostCommentDto, newComment, {excludeExtraneousValues:true});
            return postCommentDto;
        } catch (error) {
            throw error;
        }
    }

    async deleteAllPostComments(postId: string){
        try {
            const result = await this.postCommentRepository.deleteMany({postCommented: postId});
            console.log(`Total comments deleted:${result}`);
        } catch (error) {
            throw error;
        }
    }
}