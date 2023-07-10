import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Status } from 'src/shared/enums/status.enum';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { LoggerService } from 'src/common/services/utils/logger.service';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
      private loggerService: LoggerService
  ){}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
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

    const apiInfo = this.loggerService.formatApiInfo(request);
    const responseStatus = this.loggerService.formatResponseStatusCode(status);
    // this.winstonLogger.log('error', `${errorStatus}; Message: ${exception.message}; Stack: ${exception.stack}`);

    response.status(status).json({
      status : Status.ERROR,
      statusCode : status,
      data : [],
      message : exception.message,
      validationMessages:bodyMessage,
      stack : exception.stack
    })

    this.loggerService.logError(`Response: ${apiInfo}; ${responseStatus}; Message: ${exception.message}; Stack: ${exception.stack}`);
  }
}
