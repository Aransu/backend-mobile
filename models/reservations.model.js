import mongoose from "mongoose";

const RevservationsSchema = new mongoose.Schema({
    user: {
        type: Object,
        required: [true, 'missing user_id']
    },
    room: {
        type: Object,
        required: [true, 'missing room_id']
    },
    start_date: {
        type: Date,
        required: [true, 'missing start date']
    },
    end_date: {
        type: Date,
        required: [true, 'missing end date']
    },
    created_at: {
        type: Date
    },
    total: {
        type: Number
    },
    created_at: {
        type: Date
    }


})

export default mongoose.model('reservations', RevservationsSchema)