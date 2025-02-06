import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserRepository } from 'src/user/user.repository';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly userRepository: UserRepository, private readonly jwtService: JwtService){}

    async login(data: LoginDto){
        try {
            const user = await this.userRepository.findByEmailAndPassword(data.email);
            if(!user) {
                throw new UnauthorizedException(`The data provided is incorrect`);
            }

            const isPassword = await bcrypt.compare(data.password, user.password);
            if (!isPassword) {                
                if (user.loginAttempts >= 5) {
                    throw new UnauthorizedException(`User is locked`);
                }
            }

            const token = await this.jwtService.signAsync({
                userId: user.id,
                role: user.role,
                email: user.email
            }, {
                expiresIn: '7d'
            });

            return { token, ...user};
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new InternalServerErrorException('An unexpected error occurred');
        }
    }

    async refreshToken(oldToken: string) {
        try {
            const decoded = await this.jwtService.verifyAsync(oldToken);
            const user = await this.userRepository.findOne(decoded.userId);
    
            if (!user) {
                throw new UnauthorizedException('User not found');
            }
    
            const newToken = await this.jwtService.signAsync({
                userId: user.id,
                role: user.role,
                email: user.email
            }, { expiresIn: '7d' });
    
            return { token: newToken };
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}