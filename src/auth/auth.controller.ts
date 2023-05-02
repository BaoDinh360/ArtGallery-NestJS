import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from 'src/user/dtos/user-login.dto';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Request } from 'express';

@Controller('api/auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}
    //api/auth/login
    @Post('login')
    async signIn(@Body() userLoginDto: UserLoginDto){
        return await this.authService.signIn(userLoginDto);
    }

    //api/auth/register
    @Post('register')
    async signUp(@Body() createUserDto: CreateUserDto){
        return await this.authService.SignUp(createUserDto);
    }

    @UseGuards(AuthGuard)
    //api/auth/logout
    @Post('logout')
    async signOut(@Req() request: Request){
        return await this.authService.signOut(request['user']['_id']);
    }

    // @UseGuards(AuthGuard)
    //api/auth/token
    @Post('token')
    async refreshAccessToken(@Body('refreshToken') refreshToken: string){
        return await this.authService.refreshAccessToken(refreshToken);
    }
}
