import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TransformInterceptor } from './common/interceptors/transform/transform.interceptor';
import { PostModule } from './posts/post.module';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { AllExceptionFilter } from './common/filters/all-exception/all-exception.filter';
import { EventsModule } from './events/events.module';
import { PostCommentModule } from './post-comments/post-comment.module';

import { FileModule } from './files/file.module';
import { WinstonModule } from 'nest-winston';

import { winstonOptions } from './common/configs/winston.config';
import { LogInterceptor } from './common/interceptors/log/log.interceptor';

@Module({
  imports: [
    //3rd party config module
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    WinstonModule.forRoot(winstonOptions),

    PostModule,
    PostCommentModule,
    UserModule,
    AuthModule,
    CommonModule,
    EventsModule,
    FileModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter
    },
  ],
})
export class AppModule{
}
