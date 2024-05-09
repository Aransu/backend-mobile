import User from "../models/user.model.js";
import Room from "../models/room.model.js"

const getHostedRoomService = async (req, res) => {
    try {
        const { user_id } = req.query;
        const user = await User.findOne({ _id: user_id })
        const listRoom = await Room.find({ host: user })
        let hostedList = [];
        listRoom.forEach((room) => {
            hostedList.push(room)
        })
        return {
            status: 200,
            message: "SUCCESS",
            data: {
                user,
                hostedList
            }
        }
    } catch (err) {
        return {
            status: 400,
            message: "An error occur",
            error: err.message
        }
    }
}

export { getHostedRoomService }