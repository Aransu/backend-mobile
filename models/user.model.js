import { request } from "express";
import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'missing name']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'missing email']
    },
    email_verified_at: {
        type: Date,
        required: [false]
    },
    password: {
        type: String,
        required: [true, 'missing password']
    },
    remember_token: {
        type: String,

    },
    create_at: {
        type: Date
    },
    updated: {
        type: Date
    },
    phone_number: {
        type: String,
    },
    description: {
        type: String
    },
    profile_image: {
        type: String
    }
})

export default mongoose.model('users', UserSchema)