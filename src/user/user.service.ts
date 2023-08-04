import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserRepository } from './user.repository';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Image } from 'src/shared/schemas/image.schema';

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private userRepository: UserRepository,
    ){}
    async findUserByEmail(email: string) : Promise<User | undefined>{
        //const user = await this.userModel.findOne({email: email}).select('-__v');
        const user = await this.userRepository.findOne({email: email});
        return user;
    }

    async findUserById(id: string) : Promise<User | undefined>{
        const user = await this.userRepository.findByIdWithCondition(id);
        return user;
    }

    async findUserByUsername(username: string) : Promise<User | undefined>{
        const user = await this.userRepository.findOne({username: username});
        return user;
    }

    async getUserProfile(id: string) : Promise<UserDto | undefined>{
        //const user =  await this.userModel.findById(id).select('-__v -password');
        const user = await this.userRepository.findByIdWithCondition(id, {'password':0});
        const userDto = plainToInstance(UserDto, user, {excludeExtraneousValues: true})
        const userDtoJson = instanceToPlain(userDto) as UserDto;        
        return userDtoJson;
    }

    async createNewUser(createUserDto: CreateUserDto, hashedPassword: string): Promise<UserDto> {
        const userData = {
            name: createUserDto.name,
            email: createUserDto.email,
            username: createUserDto.username,
            password: hashedPassword,
        }
        const newUser = await this.userRepository.insertOne(userData);
        const newUserDto = plainToInstance(UserDto, newUser, {excludeExtraneousValues:true});
        const newUserDtoJson = instanceToPlain(newUserDto) as UserDto;
        
        return newUserDtoJson;
    }
    
    // async updateUserAvatar(avatarImg: Image, userId: string){
    //     try {
    //         const user = await this.userRepository.findByIdWithCondition(userId);
    //         if(!user){
    //             throw new BadRequestException('User not found');
    //         }
    //         const updatedUser = await this.userRepository.find
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    async updateCurrentUser(updateUserDto: UpdateUserDto, userId: string) : Promise<UserDto>{
        try {
            const user = await this.userRepository.findByIdWithCondition(userId);
            if(!user){
                throw new BadRequestException('User not found');
            }
            const updatedUser = await this.userRepository.findByIdAndUpdateOne(userId, updateUserDto);
            const updatedUserDto = plainToInstance(UserDto, updatedUser, {excludeExtraneousValues:true})
            const updatedUserDtoJson = instanceToPlain(updatedUserDto) as UserDto;
            return updatedUserDtoJson;
        } catch (error) {
            throw error;
        }
    }
}
