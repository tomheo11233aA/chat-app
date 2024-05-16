import * as mongoose from 'mongoose';

export const OTPSchema = new mongoose.Schema({
    otp: {
        type: Number,
        required: true
    },
    isExpired: {
        type: Boolean,
        default: false,
        required: true
    },
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, { timestamps: true });