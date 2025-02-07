import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtGuard } from './guards/jwt.guard';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 10,
    }]), UserModule
  ],
  providers: [AuthService,JwtGuard],
  controllers: [AuthController]
})
export class AuthModule {}
