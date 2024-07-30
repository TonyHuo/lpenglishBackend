import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class UsersService {
  async createUser(email: string, password: string): Promise<admin.auth.UserRecord> {
    return admin.auth().createUser({
      email,
      password,
      emailVerified: false,
    });
  }

  async verifyEmail(uid: string): Promise<void> {
    await admin.auth().updateUser(uid, { emailVerified: true });
  }

  async updatePassword(uid: string, newPassword: string): Promise<void> {
    await admin.auth().updateUser(uid, { password: newPassword });
  }

  async getUserRole(uid: string): Promise<string> {
    const user = await admin.auth().getUser(uid);
    return user.customClaims?.role || 'user';
  }

  async setUserRole(uid: string, role: 'user' | 'admin'): Promise<void> {
    await admin.auth().setCustomUserClaims(uid, { role });
  }
}