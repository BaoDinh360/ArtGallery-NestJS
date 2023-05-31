import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from 'src/user/dtos/user-login.dto';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Request, Response } from 'express';

@Controller('api/auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}
    //api/auth/login
    @Post('login')
    async signIn(@Body() userLoginDto: UserLoginDto, @Res({passthrough: true}) response: Response){
        return await this.authService.signIn(userLoginDto, response);
    }

    //api/auth/register
    @Post('register')
    async signUp(@Body() createUserDto: CreateUserDto){
        return await this.authService.SignUp(createUserDto);
    }

    @UseGuards(AuthGuard)
    //api/auth/logout
    @Post('logout')
    async signOut(@Req() request: Request, @Res({passthrough: true}) response: Response){
        return await this.authService.signOut(request['user']['_id'], response);
    }

    // @UseGuards(AuthGuard)
    //api/auth/token
    // @Post('token')
    // async refreshAccessToken(@Body('refreshToken') refreshToken: string){
    //     return await this.authService.refreshAccessToken(refreshToken);
    // }
    @Post('token')
    async refreshAccessToken(@Req() request: Request, @Res({passthrough: true}) response: Response){
        let refreshToken = undefined;
        if(request.cookies['jwt-refresh']){
            refreshToken = request.cookies['jwt-refresh'];
        }
        return await this.authService.refreshAccessToken(refreshToken, response);
    }
}
