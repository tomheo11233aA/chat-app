import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PhotosModule } from './photos/photos.module';
import env from './config/env';

@Module({
  imports: [
    MongooseModule.forRoot(env.mongoURI),
    AuthModule,
    PhotosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
