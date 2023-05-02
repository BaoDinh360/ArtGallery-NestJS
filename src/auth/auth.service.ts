import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dtos/auth.dto';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { UserDto } from 'src/user/dtos/user.dto';
import { UserLoginDto } from 'src/user/dtos/user-login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AuthSession } from './schemas/auth-session.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        @InjectModel(AuthSession.name) private authSessionModel : Model<AuthSession>,
    ){}

    private accessTokenExpires: string = process.env.ACCESS_TOKEN_EXPIRES || '15m';
    private refreshTokenExpires: string = process.env.REFRESH_TOKEN_EXPIRES || '1d';

    async signIn(userLoginDto : UserLoginDto): Promise<AuthDto>{
        try {
            const user = await this.userService.findUserByEmail(userLoginDto.email);
            if(!user || !await bcrypt.compare(userLoginDto.password, user.password)){
                throw new UnauthorizedException('Incorrect email or password');
            }
            else{
                const accessToken = await this.generateAccessToken(user);
                const refreshToken = await this.generateRefreshToken(user);
                //save refreshToken to db
                await this.authSessionModel.create({
                    userId: user['_id'],
                    refreshToken: refreshToken
                })
                return {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    expiredIn: this.accessTokenExpires
                }
            }
        } catch (error) {
            throw error;
        }
    }

    async SignUp(createUserDto: CreateUserDto): Promise<AuthDto>{
        try {
            const userExist = await this.userService.findUserByEmail(createUserDto.email);
            if(userExist){
                throw new BadRequestException('User with this email already exists');
            }
            const saltRound = 10;
            const hashedPassword = await bcrypt.hash(createUserDto.password, saltRound);
            const newUser = await this.userService.createNewUser(createUserDto, hashedPassword);
            const accessToken = await this.generateAccessToken(newUser);
            const refreshToken = await this.generateRefreshToken(newUser);
            //save refreshToken to db
            await this.authSessionModel.create({
                userId: newUser['_id'],
                refreshToken: refreshToken
            })
            return {
                accessToken: accessToken,
                refreshToken: refreshToken,
                expiredIn: this.accessTokenExpires
            }
        } catch (error) {
            throw error;
        }
    }

    async signOut(userId: string){
        try {
            await this.authSessionModel.findOneAndDelete({userId: userId});
            return{
                message: 'User has signed out'
            }
        } catch (error) {
            throw error;
        }
    }

    async refreshAccessToken(refreshToken: string){
        try {
            //TH ko truyền refresh token xuống
            if(!refreshToken || refreshToken === ''){
                throw new UnauthorizedException('Unauthorized access without token');
            }
            //TH so sánh refresh token từ request với token trong DB
            const payload = await this.jwtService.decode(refreshToken);
            const authUserSession = await this.authSessionModel.findOne({userId: payload['_id']});
            //Xóa record lưu refresh token của user đó trong DB
            await this.authSessionModel.findByIdAndDelete(authUserSession._id);
            if(refreshToken !== authUserSession.refreshToken){
                throw new ForbiddenException('Refresh token does not match');
            }
            //TH check xem refresh token trong DB đã expire chưa
            const verify = await this.jwtService.verifyAsync(authUserSession.refreshToken, {
                secret: process.env.REFRESH_TOKEN_SECRET
            })
            const user = await this.userService.findUserById(payload['_id']);
            const newAccessToken = await this.generateAccessToken(user);
            const newRefreshToken = await this.generateRefreshToken(user);
            await this.authSessionModel.create({
                userId: payload['_id'],
                refreshToken: newRefreshToken
            })
            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                expiredIn: this.accessTokenExpires
            }
        } catch (error) {
            throw error;
        }
    }

    private async generateAccessToken(user : User | UserDto) : Promise<string>{
        const payload = {
            _id: user['_id'],
            username: user.username,
            email: user.email
        }
        return await this.jwtService.signAsync(payload, {
            secret: process.env.ACCESS_TOKEN_SECRET,
            expiresIn: this.accessTokenExpires 
        })
    }
    private async generateRefreshToken(user : User | UserDto) : Promise<string>{
        const payload = {
            _id: user['_id'],
            username: user.username,
            email: user.email
        }
        return await this.jwtService.signAsync(payload, {
            secret: process.env.REFRESH_TOKEN_SECRET,
            expiresIn: this.refreshTokenExpires 
        })
    }
}