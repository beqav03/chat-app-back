import { Controller, Put, Body, UploadedFile, UseInterceptors, Request, UseGuards, BadRequestException, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UserService } from 'src/user/user.service';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Controller('profile')
@UseGuards(JwtGuard) // Ensure that the user is authenticated
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getProfile(@Request() req) {
    const userId = req.user.userId;

    const user = await this.userService.findOne(userId);

    if (!user) {
      return { message: 'User not found' };
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      bio: user.bio,
    };
  }

  // Update Profile Picture
  @Put('update-picture')
  @UseInterceptors(FileInterceptor('profilePicture')) // Handle 'profilePicture' from the form
  async updateProfilePicture(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const userId = req.user.id; // Extract user ID from JWT payload

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.userService.updateProfilePicture(userId, file);
  }

  // Update Basic Profile Information (First Name, Last Name)
  @Put('update-info')
  async updateProfileInfo(@Body() updateInfoDto: UpdateUserDto, @Request() req) {
    const userId = req.user.id;
    return this.userService.update(userId, updateInfoDto);
  }

  // Update Email with Confirmation Code
  // Endpoint to initiate email update
  @Put('update-email')
  async updateEmail(@Body() updateEmailDto: { newEmail: string }, @Request() req) {
      const userId = req.user.id;
      const { newEmail } = updateEmailDto;

      // Basic validation for email
      if (!newEmail || !this.isValidEmail(newEmail)) {
          throw new BadRequestException('Invalid email format');
      }

      return this.userService.updateEmail(userId, newEmail);
  }

  // Endpoint to confirm email update after verification
  @Put('confirm-email')
  async confirmEmail(@Body() confirmEmailDto: { code: string }, @Request() req) {
      const userId = req.user.id;
      const { code } = confirmEmailDto;

      return this.userService.confirmEmailChange(userId, code);
  }

  // Helper method for email validation
  private isValidEmail(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
  }

  // Update Password
  @Put('update-password')
  async updatePassword(@Body() updatePasswordDto: { oldPassword: string; newPassword: string }, @Request() req) {
    const userId = req.user.id;
    return this.userService.updatePassword(userId, updatePasswordDto.oldPassword, updatePasswordDto.newPassword);
  }
}