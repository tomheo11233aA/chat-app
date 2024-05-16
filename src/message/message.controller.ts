import { JwtGuard } from 'src/guards/jwt.guard';
import { MessageService } from './message.service';
import { Controller, Post, UseGuards, Request, Param, Body, Get } from '@nestjs/common';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) { }

  @Post('sendMessage/:id')
  @UseGuards(JwtGuard)
  sendMessage(@Request() req, @Param('id') receiverId: string, @Body('message') message: string) {
    const senderId = req.user.userId;
    return this.messageService.sendMessage(senderId, receiverId, message);
  }

  @Get('getMessages/:id')
  @UseGuards(JwtGuard)
  getMessages(@Request() req: any, @Param('id') receiverId: string) {
    const senderId = req.user.userId;
    return this.messageService.getMessages(senderId, receiverId);
  }

  @Get('getConversations')
  @UseGuards(JwtGuard)
  getConversations(@Request() req: any) {
    const userId = req.user.userId;
    return this.messageService.getConversations(userId);
  }
}
