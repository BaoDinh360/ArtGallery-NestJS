import { MongooseRepository } from "src/database/mongoose.repository";
import { User } from "./schemas/user.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class UserRepository extends MongooseRepository<User>{
    constructor(
        @InjectModel(User.name) private userModel: Model<User>
    ){
        super(userModel)
    }
}