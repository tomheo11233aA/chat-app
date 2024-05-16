import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Message } from 'src/schemas/message.schema';
import { Conversation } from 'src/schemas/conversation.schema';

@Injectable()
export class MessageService {
    constructor(
        @InjectModel(Message.name) private messageModel: Model<Message>,
        @InjectModel(Conversation.name) private conversationModel: Model<Conversation>
    ) { }

    async sendMessage(senderId: string, receiverId: string, messageText: string) {
        try {
            let conversation = await this.conversationModel.findOne({
                participants: { $all: [senderId, receiverId] }
            });
            if (!conversation) {
                conversation = await this.conversationModel.create({
                    participants: [senderId, receiverId],
                    messages: []
                });
            }
            const newMessage = await this.messageModel.create({
                senderId,
                message: messageText,
                receiverId
            });

            if (newMessage) {
                conversation.messages.push(newMessage._id);
                await conversation.save();
            }
            // TODO: SOCKET.IO FUNCTIONALITY WILL BE ADDED HERE

            return { message: 'Message sent successfully', data: newMessage };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getMessages(senderId: string, receiverId: string) {
        try {
            const conversation = await this.conversationModel.findOne({
                participants: { $all: [senderId, receiverId] }
            }).populate({
                path: 'messages',
                model: Message.name,
            });
            if (!conversation) {
                return { message: 'No conversation found', data: [] };
            }
            return { message: 'Messages retrieved successfully', data: conversation.messages };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getConversations(userId: string) {
        try {
            const conversations = await this.conversationModel.find({
                participants: userId
            }).populate({
                path: 'messages',
                model: Message.name,
                populate: {
                    path: 'senderId receiverId',
                    model: User.name,
                    select: '_id nickname fullname username email'
                }
            });
            if (!conversations) {
                return { message: 'No conversation found', data: [] };
            }
            return { message: 'Conversations retrieved successfully', data: conversations };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

