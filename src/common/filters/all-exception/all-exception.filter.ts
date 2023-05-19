import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Status } from 'src/shared/enums/status.enum';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const status = exception instanceof HttpException ? exception.getStatus(): HttpStatus.INTERNAL_SERVER_ERROR
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    if(exception instanceof HttpException){
      status = exception.getStatus();
    }
    //nếu là lỗi JWT hết hạn thì trả về 401
    else if(exception instanceof jwt.TokenExpiredError){
      status = HttpStatus.UNAUTHORIZED;
    }
    const bodyMessage = exception['response'] !== undefined ? exception['response'] : ''

    response.status(status).json({
      status : Status.ERROR,
      statusCode : status,
      data : [],
      message : exception.message,
      validationMessages:bodyMessage,
      stack : exception.stack
    })
  }
}
