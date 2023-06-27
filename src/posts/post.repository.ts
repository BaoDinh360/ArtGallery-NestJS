import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Post } from "./schemas/post.schema";
import { MongooseRepository } from "src/database/mongoose.repository";
import { PostSearchDto } from "./dtos/post-search.dto";

@Injectable()
export class PostRepository extends MongooseRepository<Post>{
    constructor(
        @InjectModel(Post.name) private postModel : Model<Post>,
    ){
        super(postModel);
    }

    async getAllPosts(postSearchDto: PostSearchDto): Promise<Post[]>{
        let { postName, page, limit, authorId} = postSearchDto;
        console.log(authorId);
        
        let skip = (page - 1) * limit;
        const postNameRegex = new RegExp(postName, 'i');
        // const authorRegex = new RegExp(new mongoose.Types.ObjectId(authorId));
        let matchFilter = {
            postName: { $regex: postNameRegex}
        }
        if(authorId !== undefined){
            Object.assign(matchFilter, {
                author: new mongoose.Types.ObjectId(authorId)
            })
        }
        
        const result = await this.postModel.aggregate([
            {$match: 
                // {
                //     postName: { $regex: postNameRegex},
                //     // author: new mongoose.Types.ObjectId(authorId)
                //     $or : [{author: new mongoose.Types.ObjectId(authorId)}, {authorId: undefined}]
                // }
                matchFilter
            },
            {$lookup: {
                from: 'postcomments',
                localField: '_id',
                foreignField: 'postCommented',
                as: 'postComments'
            }},
            {$addFields:{
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

    async getPostsByAuthor(postSearchDto : PostSearchDto): Promise<Post[]>{
        let { page, limit, authorId, sort} = postSearchDto;

        const sortFilter: Record<string, any> = {};

        if(sort !== undefined && sort !== ''){
            const sortArray = sort.split(',');
            sortArray.forEach(item =>{
                const itemArray = item.split(':');
                sortFilter[itemArray[0]] = itemArray[1] === 'asc' ? 1 : -1
            })
        }

        let skip = (page - 1) * limit;
        let matchFilter = {
            author: new mongoose.Types.ObjectId(authorId)
        }
        const result = await this.postModel.aggregate([
            {$match: matchFilter},
            {$lookup: {
                from: 'postcomments',
                localField: '_id',
                foreignField: 'postCommented',
                as: 'postComments'
            }},
            {$addFields:{
                commentCount: {
                    $size: { '$ifNull' : ['$postComments', []]}
                },
                likeCount: {
                    $size: { '$ifNull' : ['$userLikedPost', []]}
                },
                postImage: '$postImage.path',
            }},
            {$sort: Object.keys(sortFilter).length <= 0 ? {createdAt: -1} : sortFilter},
            {$skip: skip},
            {$limit: limit},
            {$project:{description: 0, userLikedPost: 0}}
        ]);
        await this.postModel.populate(result, {path: 'author', select: '_id username'});
        return result;
    }
}