import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PhotosModule } from './photos/photos.module';
import { MessageModule } from './message/message.module';
import env from './config/env';
import { ConfigModule } from '@nestjs/config';
import { GatewaychatGateway } from './gatewaychat/gatewaychat.gateway';
import { GatewaychatGateway } from './gatewaychat/gatewaychat.gateway';

@Module({
  imports: [
    MongooseModule.forRoot(env.mongoURI),
    AuthModule,
    PhotosModule,
    MessageModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [GatewaychatGateway],
})
export class AppModule { }
