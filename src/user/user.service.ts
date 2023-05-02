import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private userModel: Model<User>
    ){}
    async findUserByEmail(email: string) : Promise<User | undefined>{
        const user = await this.userModel.findOne({email: email}).select('-__v');
        return user;
    }

    async findUserById(id: string) : Promise<User | undefined>{
        return await this.userModel.findById(id);
    }

    async getUserProfile(id: string) : Promise<User | undefined>{
        const user =  await this.userModel.findById(id).select('-__v -password');
        return user;
    }

    async createNewUser(createUserDto: CreateUserDto, hashedPassword: string): Promise<UserDto> {
        const newUser = await this.userModel.create({
            name: createUserDto.name,
            email: createUserDto.email,
            username: createUserDto.username,
            password: hashedPassword
        });
        console.log('user service', newUser);
        
        return {
            _id: newUser._id.toString(),
            name: newUser.name,
            email: newUser.email,
            username: newUser.username
        };
    }
    
    async updateCurrentUser(updateUserDto: UpdateUserDto, userId: string) : Promise<UserDto>{
        try {
            const user = await this.userModel.findById(userId);
            if(!user){
                throw new BadRequestException('User not found');
            }
            const updatedUser = await this.userModel.findByIdAndUpdate(userId, updateUserDto, {new: true});
            const userDto: UserDto={
                _id: updatedUser._id.toString(),
                name: updatedUser.name,
                email: updatedUser.email,
                username: updatedUser.username,
                avatar: updatedUser.avatar
            }
            return userDto;
        } catch (error) {
            throw error;
        }
    }
}
