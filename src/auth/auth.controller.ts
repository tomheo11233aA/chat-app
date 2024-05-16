import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayloadDto, UpdateProfileDto } from './dto/auth.dto';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() authPayload: AuthPayloadDto) {
    return await this.authService.validateUser(authPayload);
  }

  @Get('profile')
  @UseGuards(JwtGuard)
  async getProfile(@Request() req: any) {
    const user = await this.authService.getUserById(req.user.userId);
    return user;
  }

  @Post('register')
  async register(@Body() authPayload: AuthPayloadDto) {
    return await this.authService.register(authPayload);
  }

  @UseGuards(JwtGuard)
  @Post('updateProfile')
  async updateProfile(@Request() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    const userId = req.user.userId;
    return await this.authService.updateProfile(userId, updateProfileDto);
  }

  @Post('sendOTPEmail')
  async sendOTPEmail(@Body() body: any) {
    await this.authService.sendOTPEmail(body.email);
    return { message: 'OTP sent successfully to ' + body.email };
  }

  @Post('verifyOTP')
  async verifyOTP(@Body() body: { userId: string, otp: string }) {
    const result = await this.authService.verifyOTP(body);
    return result;
  }
}
