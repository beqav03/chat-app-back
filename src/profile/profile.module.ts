import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]),UserModule,EmailModule],
  controllers: [ProfileController],
  providers: [UserService],
})
export class ProfileModule {}
