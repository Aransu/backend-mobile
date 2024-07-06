import mongoose from "mongoose";

const RevservationsSchema = new mongoose.Schema({

    user_id: {
        type: String,
        required: [true, 'missing user_id']
    },
    room_id: {
        type: String,
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
    },
    payed: {
        type: Boolean,
        default: false
    }


})

export default mongoose.model('reservations', RevservationsSchema)