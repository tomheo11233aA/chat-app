import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Message } from './message.schema';
import { User } from './user.schema';
@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop({
    type: [{
      type: Types.ObjectId,
      ref: 'User'
    }]
  })
  participants: User[];

  @Prop({
    type: [{
      type: Types.ObjectId,
      ref: 'Message',
      default: []
    }]
  })
  messages: Message[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);