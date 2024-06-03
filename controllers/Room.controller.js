import { addImageToRoomService, addRoomService, getRoomInfoService, getRoomService } from "../services/Room.service.js";

const addRoom = async (req, res) => {
    const { room, err, message, status } = await addRoomService(req, res);
    if (room) {
        res.status(status).json({
            status: "SUCCESS",
            message: message,
            room: room
        })
    }
    else {
        res.status(status).json({
            status: "FAILED",
            message: message,
            error: err
        })
    }
}

const getRoom = async (req, res) => {
    const { rooms, err, message, status } = await getRoomService(req, res);

    if (status === 400) {
        return res.status(status).json({
            status: status,
            message: message,
            error: err
        });
    }

    if (Array.isArray(rooms) && rooms.length > 0) {
        return res.status(status).json({
            status: status,
            message: message,
            rooms: rooms
        });
    } else {
        return res.status(404).json({
            status: 404,
            message: "No rooms found"
        });
    }
}


const getRoomInfo = async (req, res) => {
    const { room, allDates, status, message, error } = await getRoomInfoService(req, res);
    if (!error) {
        res.status(status).json({
            status: status,
            message: message,
            data: {
                room,
                bookedDate: allDates
            }
        })
    } else {
        res.status(status).json({
            status: status,
            message: message,
            error: error
        })
    }

}

const addImageToRoom = async (req, res) => {
    const { room, error, status, message } = await addImageToRoomService(req, res);
    if (room) {
        res.status(status).json({
            status: status,
            message: message,
            room: room
        })
    } else {
        res.status(status).json({
            status: status,
            message: message,
            error: error
        })
    }
}
export { addRoom, getRoom, getRoomInfo, addImageToRoom }