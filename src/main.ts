import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import * as cookieParser from 'cookie-parser';
// import { ValidationPipe } from './common/pipes/validation.pipe';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //#region App configuration
  //serve static image folder
  app.use('/uploads', express.static('uploads'));
  //cookie parser
  app.use(cookieParser());
  //global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    disableErrorMessages: false,
    enableDebugMessages: true,
    exceptionFactory: (validationErrors: ValidationError[] = []) =>{
      const validationMsg = {};
      validationErrors.forEach(err =>{
        if(err.constraints != undefined){
          validationMsg[err.property] = Object.values(err.constraints).join('. ').trim();
        }
        else if(err.children.length > 0){
          const nestedValidation = {};
          err.children.forEach(nested => {
            nestedValidation[nested.property] = Object.values(nested.constraints).join('. ').trim();
          })
          validationMsg[err.property] = nestedValidation;
        }
      });
      return new BadRequestException(validationMsg);
    }
  }));
  
  //#endregion
  
  await app.listen(port, '0.0.0.0');
}
bootstrap();
