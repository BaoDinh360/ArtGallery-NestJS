import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map, tap } from 'rxjs';
import { LoggerService } from 'src/common/services/utils/logger.service';
import { Status } from 'src/shared/enums/status.enum';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(
    private loggerService: LoggerService
  ){}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const apiInfo = this.loggerService.formatApiInfo(request);
    
    this.loggerService.logInfo(`Request: ${apiInfo}`);

    return next.handle().pipe(
      tap((responseResult) =>{
        if(responseResult.status === Status.SUCCESS){
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const responseStatus = this.loggerService.formatResponseStatusCode(statusCode);
          this.loggerService.logInfo(`Response: ${apiInfo}; ${responseStatus}; Message: ${responseResult.message}`);
        }
      })
    );
  }
}
