import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateAdmin(request.user);
  }

  private async validateAdmin(user: any): Promise<boolean> {
    if (!user) {
      return false;
    }
    const role = await this.usersService.getUserRole(user.uid);
    return role === 'admin';
  }
}