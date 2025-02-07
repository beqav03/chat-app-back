import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity'; // Assuming you have a User entity
var bcrypt = require('bcryptjs');
import { randomInt } from 'crypto'; // For generating the email confirmation code

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  // Update user profile information
  async updateProfile(userId: number, firstName: string, lastName: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    user.firstName = firstName;
    user.lastName = lastName;

    return this.userRepo.save(user);
  }

  // Update profile picture
  async updateProfilePicture(userId: number, photoPath: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    user.profilePicture = photoPath; // Assuming you have a profilePicture column in your User entity

    return this.userRepo.save(user);
  }

  // Update email with confirmation code
  async updateEmail(userId: number, newEmail: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Generate a 4-digit confirmation code
    const confirmationCode = randomInt(1000, 9999).toString();

    user.email = newEmail;
    user.emailConfirmationCode = confirmationCode; // Assuming you have this field in your User entity

    await this.userRepo.save(user);

    // You'd send this code to the user's email address (using an email service like Nodemailer)

    return { message: 'A confirmation code has been sent to your email.' };
  }

  // Update password
  async updatePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Check if the old password is correct
    const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordCorrect) throw new BadRequestException('Incorrect old password');

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    return this.userRepo.save(user);
  }
}
