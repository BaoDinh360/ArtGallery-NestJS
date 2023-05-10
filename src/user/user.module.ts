import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    CommonModule
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, MongooseModule, UserRepository]
})
export class UserModule {}
