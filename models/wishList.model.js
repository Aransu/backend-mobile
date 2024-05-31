import mongoose from "mongoose";


const wishListSchema = new mongoose.Schema({
    room_id: String,
    user_id: String
})

export default mongoose.model('wishList', wishListSchema)