import { Injectable } from '@nestjs/common';

@Injectable()
export class PhotosService {
    uploadFile(file: Express.Multer.File) {
        return file;
    }
}
