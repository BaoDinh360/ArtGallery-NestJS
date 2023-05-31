import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Post } from "./schemas/post.schema";
import { MongooseRepository } from "src/database/mongoose.repository";

@Injectable()
export class PostRepository extends MongooseRepository<Post>{
    constructor(
        @InjectModel(Post.name) private postModel : Model<Post>,
    ){
        super(postModel);
    }

    async getAllPosts(skip: number, limit: number): Promise<Post[]>{
        const result = await this.postModel.aggregate([
            {$lookup: {
                from: 'postcomments',
                localField: '_id',
                foreignField: 'postCommented',
                as: 'postComments'
            }},
            {$addFields:{
                // commentCount: {$size: '$postComments'},
                // likeCount: {$size: '$userLikedPost'},
                commentCount: {
                    $size: { '$ifNull' : ['$postComments', []]}
                },
                likeCount: {
                    $size: { '$ifNull' : ['$userLikedPost', []]}
                },
                postImage: '$postImage.path'
            }},
            {$sort: {createdAt: -1}},
            {$skip: skip},
            {$limit: limit}
        ])
        await this.postModel.populate(result, {path: 'author', select: '_id username avatar'});
        return result;
    }

    async getPostById(id: string): Promise<Post>{
        const result = await this.postModel.aggregate([
            {$match: {_id: new mongoose.Types.ObjectId(id)}},
            {$lookup: {
                from: 'postcomments',
                localField: '_id',
                foreignField: 'postCommented',
                as: 'postComments'
            }},
            {$addFields:{
                // commentCount: {$size: '$postComments'},
                // likeCount: {$size: '$userLikedPost'},
                commentCount: {
                    $size: { '$ifNull' : ['$postComments', []]}
                },
                likeCount: {
                    $size: { '$ifNull' : ['$userLikedPost', []]}
                },
                postImage: '$postImage.path',
            }},
            {$limit: 1}
        ])
        await this.postModel.populate(result, {path: 'author', select: '_id username avatar'});
        return result[0];
    }

    async getPostsByAuthor(skip: number, limit: number, authorId: string): Promise<Post[]>{
        const result = await this.postModel.aggregate([
            {$match: {author: new mongoose.Types.ObjectId(authorId)}},
            {$lookup: {
                from: 'postcomments',
                localField: '_id',
                foreignField: 'postCommented',
                as: 'postComments'
            }},
            {$addFields:{
                // commentCount: {$size: '$postComments'},
                // likeCount: {$size: '$userLikedPost'},
                commentCount: {
                    $size: { '$ifNull' : ['$postComments', []]}
                },
                likeCount: {
                    $size: { '$ifNull' : ['$userLikedPost', []]}
                },
                postImage: '$postImage.path',
            }},
            {$sort: {createdAt: -1}},
            {$skip: skip},
            {$limit: limit},
            {$project:{description: 0, userLikedPost: 0}}
        ]);
        await this.postModel.populate(result, {path: 'author', select: '_id username'});
        return result;
    }
}