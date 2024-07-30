import { Module } from '@nestjs/common';
import { ContentListController } from './content-list.controller';
import { ContentListService } from './content-list.service';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module'; // 添加这行

@Module({
  imports: [AuthModule, UsersModule], // 添加 UsersModule
  controllers: [ContentListController],
  providers: [ContentListService],
})
export class ContentListModule {}