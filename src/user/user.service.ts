import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepo: UserRepository, private readonly userRepository: UserRepository){}

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
        // Call the repository method to update the email and generate a verification code
        await this.userRepository.updateEmail(userId, newEmail);
        return { message: 'A verification code has been sent to your new email' };
    }    

    async updatePassword(userId: number, oldPassword: string, newPassword: string) {
        if (!oldPassword || !newPassword) {
            throw new BadRequestException('Both old and new passwords are required');
        }

        return this.userRepository.updatePassword(userId, oldPassword, newPassword);
    }
}
