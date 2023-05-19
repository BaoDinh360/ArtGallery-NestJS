import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
// import { ValidationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //#region App configuration
  //serve static image folder
  app.use('/uploads', express.static('uploads'));
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
  //CORS
  // app.enableCors({
  //   origin: [process.env.CLIENT_DOMAIN_DEV],
  //   preflightContinue: false
  // })
  //#endregion
  
  await app.listen(3000);
}
bootstrap();
