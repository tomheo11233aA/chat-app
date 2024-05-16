import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    role: {
        type: String
    },
    about: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    nickname: {
        type: String
    },
    fullname: {
        type: String
    },
    username: {
        type: String
    },
    dateOfBirth: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    isVerify: {
        type: Boolean,
        default: false,
        required: true
    },
}, { timestamps: true });