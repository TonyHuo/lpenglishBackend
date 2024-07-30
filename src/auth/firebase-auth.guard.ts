import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateToken(request);
  }

  private async validateToken(request: any): Promise<boolean> {
    const token = request.headers.authorization;
    if (!token) {
      return false;
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token.replace('Bearer ', ''));
      request.user = decodedToken;
      return true;
    } catch (error) {
      return false;
    }
  }
}