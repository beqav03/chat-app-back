import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [ProfileController],
})
export class ProfileModule {}
