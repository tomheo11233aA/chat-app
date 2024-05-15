import { Body, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { AuthPayloadDto, IOTP, IUser, UpdateProfileDto } from './dto/auth.dto';
import * as nodemailer from 'nodemailer';
import * as dayjs from 'dayjs';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectModel('User') private userModel: Model<IUser>,
        @InjectModel('OTP') private otpModel: Model<IOTP>
    ) { }

    async validateUser({ email, password }: AuthPayloadDto): Promise<any> {
        try {
            const user = await this.userModel.findOne({ email });
            if (user && await bcrypt.compare(password, user.password)) {
                const { password, ...result } = user.toJSON();
                return { ...result, token: this.jwtService.sign(result) };
            }
            return null;
        } catch (error) {
            console.log('AuthService -> validateUser -> error', error);
            throw new HttpException(error.message, error.status);
        }
    }

    async register(registerDto: AuthPayloadDto): Promise<any> {
        try {
            const userExist = await this.userModel.findOne({ email: registerDto.email });
            if (userExist) throw new HttpException('User already exists', 409);
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(registerDto.password, salt);
            const newUser = new this.userModel({
                email: registerDto.email,
                password: hashedPassword,
            });
            const result = await newUser.save();
            const { password, ...user } = result.toJSON();
            return { ...user, token: this.jwtService.sign(user) };
        } catch (error) {
            console.log('AuthService -> register -> error', error);
            throw new HttpException(error.message, error.status);
        }
    }

    async updateProfile(userId: string, @Body() updateProfileDto: UpdateProfileDto): Promise<IUser> {
        const user = await this.userModel.findById(userId).exec();
        if (!user) throw new HttpException('User not found', 404);
        try {
            const result = await this.userModel.findByIdAndUpdate(userId, updateProfileDto, { new: true }).exec();
            const { password, ...user } = result.toJSON();
            return user;
        } catch (error) {
            console.log('AuthService -> updateProfile -> error', error);
            throw new HttpException(error.message, error.status);
        }
    }

    async getUserById(userId: string): Promise<any> {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new HttpException('User not found', 404);
        }
        const { username, email, fullname, dateOfBirth } = user.toJSON();
        return { username, email, fullname, dateOfBirth };
    }

    async sendOTPEmail(email: string): Promise<string> {
        if (!email) throw new HttpException('Email is required', 400);
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) throw new HttpException('User not found', 404);
        const newOtp = new this.otpModel({
            otp,
            idUser: user._id,
            isExpired: false
        });
        await newOtp.save();
        let htmlContent = `
        <tbody>
                <tr>
                <td style="padding:8px 0;background:#161616" align="center" valign="middle">
                    <a href="http://bizpoint.dk-technical.vn" rel="noopener" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://bizpoint.dk-technical.vn&amp;source=gmail&amp;ust=1715834935794000&amp;usg=AOvVaw1XeW5qKqJi0KDLzd1kCdh-">
                        <img style="border:0;max-width:500px" src="https://ci3.googleusercontent.com/meips/ADKq_NY5cNWoZqJW3ASC-QG5u-3kwlGR6GvAP8zTNmHBI0_goF6L2-9XVTGn9kHcSqf-c4bgr9zJzwIAxGXZRCnVeiOMPPhJuMpLoKwYn6Kg4coTBWId7pBrgwhrItxEQWJKXoHBaySxHEKNGhU=s0-d-e1-ft#https://res.cloudinary.com/dszhslyjq/image/upload/v1701095623/bizpoint/bp_dtqkzn.png" alt="bizpoint.dk-technical.vn" class="CToWUd" data-bit="iit">
                    </a>
                </td>
                </tr>
                <tr>
                <td>
                    <div style="padding:0 30px;background:#161616">
                    <table border="0" width="100%" cellspacing="0" cellpadding="0">
                        <tbody>
                        <tr>
                            <td style="font-size:14px;line-height:30px;padding:20px 0;color:#fff">
                            <p>Xin chào,${email}!</p>
                            <p>Vui lòng sử dụng mã OTP dưới đây để hoàn thành quy trình kích hoạt Smart OTP cho tài khoản HiChat của bạn. Mã OTP có hiệu lực trong 5 phút.</p>
                            <p style="font-size:25px;letter-spacing:3px;text-align:center">${otp}</p>
                            <div style="margin-top:50px"></div>
                            <div>Cảm ơn bạn,</div>
                            <div>HiChat Team</div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                </td>
                </tr>
            </tbody>
        `;
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'phucnamvan@gmail.com',
                pass: 'vvoq dsgj bubn runx'
            }
        });
        let mailOptions = {
            from: 'phucnamvan@gmail.com',
            to: email,
            subject: 'OTP Verification',
            html: htmlContent
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) throw new HttpException(error.message, 400);
        });
        return otp;
    }

    async verifyOTP(@Body() body: { userId: string, otp: string }): Promise<any> {
        const otp = await this.otpModel.findOne({ idUser: body.userId, otp: body.otp }).exec();
        if (!otp) throw new HttpException('Invalid OTP', 400);
        if (otp.isExpired) throw new HttpException('OTP is expired', 400);
        const now = dayjs().unix();
        const createdAt = dayjs(otp.createdAt).unix();
        if (now - createdAt > 300) {
            await this.otpModel.findByIdAndUpdate(otp._id, { isExpired: true }).exec();
            throw new HttpException('OTP is expired', 400);
        }
        await this.userModel.findByIdAndUpdate(body.userId, { isVerify: true }).exec();
        await this.otpModel.findByIdAndDelete(otp._id).exec();
        const user = await this.userModel.findById(body.userId).exec();
        const { password, ...result } = user.toJSON();
        return { ...result, token: this.jwtService.sign(result) };
    }
}
