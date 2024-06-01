import { Timestamp } from "mongodb";
import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    name: String,
    summary: String,
    transit: String,
    house_rules: String,
    thumbnail_urls: [String],
    host_id: String,
    street: String,
    smart_location: String,
    country: String,
    latitude: Number,
    longitude: Number,
    room_type: String,
    bathRooms: Number,
    bedRooms: Number,
    beds: Number,
    price: Number,
    weekly_price: Number,
    review: String,
    created_at: Date,
})

export default mongoose.model('room', roomSchema)