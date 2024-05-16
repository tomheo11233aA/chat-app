import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Message, MessageSchema } from 'src/schemas/message.schema';
import { Conversation, ConversationSchema } from 'src/schemas/conversation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Conversation.name, schema: ConversationSchema }
    ])
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule { }
