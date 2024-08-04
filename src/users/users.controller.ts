import { Controller,Get, Post, Body, Put, Param, UseGuards, Req, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

   constructor(private readonly usersService: UsersService) {}
   

  @UseGuards(FirebaseAuthGuard)
  @Post('additional-info')
  async addAdditionalInfo(@Body() additionalInfo: any, @Req() req: any) {
    this.logger.log(`Attempting to add additional info for user. Body: ${JSON.stringify(additionalInfo)}`);
    try {
      const uid = req.user.uid;
      this.logger.log(`User UID from request: ${uid}`);
      const result = await this.usersService.addAdditionalInfo(uid, additionalInfo);
      this.logger.log(`Additional info added successfully for user ${uid}`);
      return result;
    } catch (error) {
      this.logger.error(`Error adding additional info: ${error.message}`, error.stack);
      throw error;
    }
  }

  @UseGuards(FirebaseAuthGuard)
  @Put(':uid/verify-email')
  async verifyEmail(@Param('uid') uid: string) {
    this.logger.log(`Attempting to verify email for user ${uid}`);
    try {
      await this.usersService.verifyEmail(uid);
      this.logger.log(`Email verified successfully for user ${uid}`);
      return { message: 'Email verified successfully' };
    } catch (error) {
      this.logger.error(`Error verifying email for user ${uid}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @UseGuards(FirebaseAuthGuard)
  @Put(':uid/update-password')
  async updatePassword(@Param('uid') uid: string, @Body() updatePasswordDto: { newPassword: string }) {
    this.logger.log(`Attempting to update password for user ${uid}`);
    try {
      await this.usersService.updatePassword(uid, updatePasswordDto.newPassword);
      this.logger.log(`Password updated successfully for user ${uid}`);
      return { message: 'Password updated successfully' };
    } catch (error) {
      this.logger.error(`Error updating password for user ${uid}: ${error.message}`, error.stack);
      throw error;
    }
  }

}