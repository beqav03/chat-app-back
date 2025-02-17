import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]),UserModule],
  controllers: [ProfileController],
})
export class ProfileModule {}
