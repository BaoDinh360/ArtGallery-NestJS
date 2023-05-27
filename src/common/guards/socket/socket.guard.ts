import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class SocketGuard implements CanActivate {
  constructor(
    private jwtService: JwtService
  ){}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    
    const data = context.switchToWs().getData();
    const client = context.switchToWs().getClient();
    const accessToken = data.accessToken;
    try{
      if(!accessToken || accessToken == ''){
        throw new UnauthorizedException('Unauthorized access without token');
      }
      const payload = await this.jwtService.verifyAsync(
        accessToken,
        {
          secret: process.env.ACCESS_TOKEN_SECRET
        }
      )
      client.userId = payload['_id'];
    }
    catch(error){
      throw error;
    }
    return true;
  }
}
