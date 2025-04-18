import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Throttle } from '@nestjs/throttler';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('login')
    @Throttle({ default: { limit: 5, ttl: 60 } })
    async login(@Body() data: LoginDto) {
      return this.authService.login(data);
    }

    @Post('logout')
    @UseGuards(JwtGuard)
    logout(@Body() data: LoginDto) {
      return this.authService.logout(data);
    }
}