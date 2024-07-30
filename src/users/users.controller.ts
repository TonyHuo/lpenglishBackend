import { Controller, Post, Body, Put, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: { email: string; password: string }) {
    return this.usersService.createUser(createUserDto.email, createUserDto.password);
  }

  @UseGuards(FirebaseAuthGuard)
  @Put(':uid/verify-email')
  async verifyEmail(@Param('uid') uid: string) {
    await this.usersService.verifyEmail(uid);
    return { message: 'Email verified successfully' };
  }

  @UseGuards(FirebaseAuthGuard)
  @Put(':uid/update-password')
  async updatePassword(@Param('uid') uid: string, @Body() updatePasswordDto: { newPassword: string }) {
    await this.usersService.updatePassword(uid, updatePasswordDto.newPassword);
    return { message: 'Password updated successfully' };
  }
}