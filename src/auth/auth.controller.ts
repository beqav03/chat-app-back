import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}
    @Post('login')
    @Throttle({ default: { limit: 5, ttl: 60 }})
    login(@Body() data: LoginDto) {
        return this.authService.login(data);
    }

    @Post('logout')
    logout(@Body() data: LoginDto) {
        return this.authService.logout(data);
    }
}
