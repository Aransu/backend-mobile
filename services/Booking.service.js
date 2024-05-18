import reservations from "../models/reservations.model.js";
import User from '../models/user.model.js'
import Room from '../models/room.model.js'
const bookingService = async (req, res) => {
    try {
        const { user_id, room_id, start_date, end_date } = req.body;
        if (!user_id || !room_id || !start_date || !end_date) {
            return res.status(400).json({
                status: "FAILED",
                message: "Missing fields"
            });
        }
        console.log(typeof (start_date))
        const [year, month, day] = start_date.split('-');
        const startDate = new Date(`${year}-${month}-${day}T00:00:00Z`);
        const [eyear, emonth, eday] = end_date.split('-');
        const endDate = new Date(`${eyear}-${emonth}-${eday}T00:00:00Z`);
        const millisecondsDiff = endDate.getTime() - startDate.getTime();
        const daysDiff = Math.floor(millisecondsDiff / (1000 * 60 * 60 * 24));
        const createdAt = Date.now();
        const user = await User.findOne({ _id: user_id })
        const room = await Room.findOne({ _id: room_id })
        const total = daysDiff * room.price;
        const newReservations = new reservations({
            user,
            room,
            start_date: startDate,
            end_date: endDate,
            total,
            created_at: createdAt
        })
        await newReservations.save();
        return { reservations: newReservations }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "FAILED",
            message: "An error occurred",
            error: err.message
        });
        return { reservations: null }
    }
}

export { bookingService };