import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Message extends Document {
    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true
    })
    senderId: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true
    })
    receiverId: Types.ObjectId;

    @Prop({
        required: true
    })
    message: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);