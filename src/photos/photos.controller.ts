import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) { }
  @Post('upload')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.photosService.uploadFile(file);
  }
}
