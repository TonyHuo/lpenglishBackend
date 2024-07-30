import { Controller,Get,Param,Query,Post, UseGuards, UploadedFile, UseInterceptors, BadRequestException ,NotFoundException,InternalServerErrorException,Logger} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}
  private readonly logger = new Logger(UploadController.name);
  @Post('json')
  @UseGuards(FirebaseAuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadJson(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const jsonContent = JSON.parse(file.buffer.toString());
      
      if (typeof jsonContent !== 'object' || jsonContent === null) {
        throw new BadRequestException('Invalid JSON content');
      }

      await this.uploadService.uploadJsonToFirebase(jsonContent);
      return { message: 'Upload successful' };
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new BadRequestException('Invalid JSON format');
      }
      throw error;
    }
  }
  
  @Get('json/:id')
  @UseGuards(FirebaseAuthGuard)
  async getJson(@Param('id') id: string) {
    this.logger.log(`Received request to get JSON with id: ${id}`);
    
    try {
      this.logger.log(`Attempting to retrieve JSON content for id: ${id}`);
      const jsonContent = await this.uploadService.getJsonById(id);
      
      if (!jsonContent) {
        this.logger.warn(`JSON with id ${id} not found`);
        throw new NotFoundException(`JSON with id ${id} not found`);
      }
      
      this.logger.log(`Successfully retrieved JSON content for id: ${id}`);
      return jsonContent;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error retrieving JSON content for id ${id}: ${error.message}`);
      throw new InternalServerErrorException('Error retrieving JSON content');
    }
  }

  @Get('json')
  async getJsonBySource(@Query('source') source: string) {
    return this.uploadService.getJsonBySource(source);
  }
  @Get('sources')
  async getAllSources() {
    return this.uploadService.getAllSources();
  }
  @Get('sourcesimages')
  async getAllSourcesImages() {
    return this.uploadService.getSourceCollections();
  }
  @Get('sourceslatest')
  async getAllSourcesLatest() {
    return this.uploadService.getLatestVideos();
  }

}