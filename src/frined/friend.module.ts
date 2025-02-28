import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { User } from '../user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { FriendRepository } from './friend.repository';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [TypeOrmModule.forFeature([Friend, User]), UserModule, ChatModule],
  controllers: [FriendController],
  providers: [FriendService, FriendRepository],
  exports: [FriendService],
})
export class FriendModule {}