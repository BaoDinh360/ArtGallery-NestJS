import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { CreateCarDto } from './create-car.dto';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @Get('all')
  getALl(@Req() request : Request) : string{
    return 'yes';
  }

  @Get('all/:dog')
  getOneThing(@Param('dog') dog : string) : string{
    console.log(dog);
    return `This is a dog name: ${dog}`;
  }

  @Post()
  createSth(@Body() createCarDto : CreateCarDto) : string{
    console.log(createCarDto);
    return 'created sth';
  }
  
}
