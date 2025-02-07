import { Controller, Put, Body, UploadedFile, UseInterceptors, Request, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('profile')
@UseGuards(JwtGuard) // Ensure that the user is authenticated
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // Update Profile Picture
  @Put('update-picture')
  @UseInterceptors(FileInterceptor('profilePicture')) // Handle 'profilePicture' from the form
  async updateProfilePicture(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const userId = req.user.id; // Assuming the user ID is stored in the JWT payload
    if (!file) {
      throw new Error('No file uploaded');
    }
    return this.profileService.updateProfilePicture(userId, file);
  }

  // Update Basic Profile Information (First Name, Last Name, Bio)
  @Put('update-info')
  async updateProfileInfo(
    @Body() updateInfoDto: { firstName: string; lastName: string; bio: string },
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.profileService.updateProfile(userId, updateInfoDto);
  }

  // Update Email with Confirmation Code
  @Put('update-email')
  async updateEmail(
    @Body() updateEmailDto: { newEmail: string },
    @Request() req,
  ) {
    const userId = req.user.id;
    const { newEmail } = updateEmailDto;

    // Basic validation for email
    if (!newEmail || !this.isValidEmail(newEmail)) {
      throw new Error('Invalid email format');
    }

    return this.profileService.updateEmail(userId, newEmail);
  }

  // Update Password
  @Put('update-password')
  async updatePassword(
    @Body() updatePasswordDto: { oldPassword: string; newPassword: string },
    @Request() req,
  ) {
    const userId = req.user.id;
    const { oldPassword, newPassword } = updatePasswordDto;

    // Basic validation for passwords
    if (!oldPassword || !newPassword) {
      throw new Error('Both old and new passwords are required');
    }

    return this.profileService.updatePassword(userId, updatePasswordDto);
  }

  // Simple email validation function
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }
}