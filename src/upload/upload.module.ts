import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { UsersModule } from '../users/users.module'; // 添加这行

@Module({
  imports: [UsersModule], // 添加这行
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}