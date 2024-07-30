import { Controller, Get, Post, Body, Put, Param, UseGuards,Req } from '@nestjs/common';
import { ContentListService } from './content-list.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('content-lists')
export class ContentListController {
  constructor(private readonly contentListService: ContentListService) {}

  @UseGuards(FirebaseAuthGuard, AdminGuard)
  @Post()
  async createContentList(@Body() createContentListDto: { title: string; description: string }, @Req() req) {
    return this.contentListService.createContentList(createContentListDto.title, createContentListDto.description, req.user.uid);
  }

  @UseGuards(FirebaseAuthGuard)
  @Put(':id/follow')
  async followContentList(@Param('id') id: string, @Req() req) {
    await this.contentListService.followContentList(id, req.user.uid);
    return { message: 'Content list followed successfully' };
  }

  @UseGuards(FirebaseAuthGuard)
  @Put(':id/unfollow')
  async unfollowContentList(@Param('id') id: string, @Req() req) {
    await this.contentListService.unfollowContentList(id, req.user.uid);
    return { message: 'Content list unfollowed successfully' };
  }

  @Get()
  async getContentLists() {
    return this.contentListService.getContentLists();
  }
}