import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { AdminGuard } from './admin.guard';

@Module({
  imports: [UsersModule],
  providers: [FirebaseAuthGuard, AdminGuard],
  exports: [FirebaseAuthGuard, AdminGuard],
})
export class AuthModule {}