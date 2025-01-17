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
  async addAdditionalInfo(uid: string, additionalInfo: any) {
    // Here you would typically save the additional info to your database
    // This is just a placeholder implementation
    console.log(`Adding additional info for user ${uid}:`, additionalInfo);
    // You might want to return something here, depending on your needs
    return { success: true };
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