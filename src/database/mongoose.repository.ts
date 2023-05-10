import { FilterQuery, Model } from "mongoose";

export abstract class MongooseRepository<T>{
    constructor(private readonly mongooseModel: Model<T>){}

    async findOne(
        filterQuery: FilterQuery<T>,
        projection?: Record<string, unknown>
    ): Promise<T | null>{
        return await this.mongooseModel.findOne(filterQuery, {
            __v: 0,
            ...projection
        });
    }

    async findAll(): Promise<T[]>{
        return await this.mongooseModel.find();
    }

    async findByIdWithCondition(
        id: string,
        projection?: Record<string, unknown>,
        options?: any
    ): Promise<T>{
        return await this.mongooseModel.findById(id, {
            __v: 0,
            ...projection
        }, options);
    }

    async findByCondition(
        filterQuery?: FilterQuery<T>,
        projection?: Record<string, unknown>,
        options?: any,
    ): Promise<T[]>{
        return await this.mongooseModel.find(filterQuery, {
            __v:0,
            ...projection
        }, options);
    }

    async coundDocumentWithCondition(
        filterQuery?: FilterQuery<T>,
    ): Promise<number>{
        return await this.mongooseModel.find(filterQuery).countDocuments();
    }

    async insertOne(createData: unknown): Promise<T>{
        return await this.mongooseModel.create(createData);
    }

    async findByIdAndUpdateOne(
        id: string,
        updateData: unknown,
        options?: Record<string, unknown>,
    ): Promise<T>{
        return await this.mongooseModel.findByIdAndUpdate(id, updateData, {
            new: true,
            ...options
        });
    }

    async updateOne(
        filterQuery: FilterQuery<T>,
        updateData: unknown
    ): Promise<T>{
        return await this.mongooseModel.findOneAndUpdate(filterQuery, updateData, {new:true});
    }

    async findByIdAndDeleteOne(id: string): Promise<boolean>{
        const deletedResult = await this.mongooseModel.findByIdAndDelete(id);
        return deletedResult.$isDeleted(true);
    }

    async deleteOne(filterQuery: FilterQuery<T>): Promise<boolean>{
        const deletedResult = await this.mongooseModel.findOneAndDelete(filterQuery);
        return deletedResult.$isDeleted(true);
    }
}