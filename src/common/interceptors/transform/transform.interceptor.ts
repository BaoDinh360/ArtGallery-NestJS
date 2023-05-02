import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Status } from 'src/shared/enums/status.enum';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ResponseResult<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseResult<T>> {
    return next.handle().pipe(map(data =>({
      status : Status.SUCCESS, // mặc định là success
      statusCode : context.switchToHttp().getResponse().statusCode,
      data : data,
      message : '',
      stack : ''
    })));
  }
}

export interface ResponseResult<T>{
  status : number,
  statusCode : number,
  data : T,
  message : string,
  stack : string
}
