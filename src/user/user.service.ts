import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { EmailService } from 'src/email/email.service';
var bcrypt = require('bcryptjs');

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepo: UserRepository, private readonly userRepository: UserRepository,
    private readonly emailService: EmailService ){}

    findAll(){
        return this.userRepository.findAll();
    }

    async findOne(id: number){
        const user = await this.userRepository.findOne(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async create(data: CreateUserDto){
        if (data.password !== data.confirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }

        return this.userRepository.create(data);
    }

    async update(id: number, data: UpdateUserDto): Promise<User> {
        const user = await this.userRepository.findOne(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        await this.userRepo.update(id, data);
        return this.findOne(id);
    }

    async remove(id: number){
        const user = await this.findOne(id);
        await this.userRepo.remove(user.id);
    }

    async updateProfilePicture(userId: number, file: Express.Multer.File): Promise<void> {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }
        const filePath = `uploads/profile-pictures/${userId}-${Date.now()}-${file.originalname}`;
        await this.userRepository.updateProfilePicture(userId, filePath);
    }

     async updateEmail(userId: number, newEmail: string): Promise<{ message: string }> {
        const user = await this.userRepository.findOne(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const verificationCode = crypto.randomInt(1000, 9999).toString();
        await this.userRepository.updateEmail(userId, newEmail, verificationCode);
        await this.emailService.sendVerificationEmail(newEmail, verificationCode);

        return { message: 'A verification code has been sent to your new email' };
    }

    async confirmEmailChange(userId: number, code: string): Promise<{ message: string }> {
        const user = await this.userRepository.findOne(userId);
        if (!user || user.emailVerificationCode !== code) {
            throw new BadRequestException('Invalid verification code');
        }

        await this.userRepository.confirmEmailChange(userId);

        return { message: 'Email successfully updated' };
    } 

    async updatePassword(userId: number, oldPassword: string, newPassword: string) {
        const user = await this.userRepository.findOne(userId);
        if (!user) throw new NotFoundException('User not found');
        
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) throw new BadRequestException('Old password is incorrect');
        
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await this.userRepository.update(userId, { password: hashedPassword });
        
        return { message: "Password updated successfully" };
      }
      

    async searchUsers(keyword: string) {
        return this.userRepository.searchUsers(keyword);
    }
}
