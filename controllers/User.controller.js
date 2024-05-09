import { getHostedRoomService } from "../services/User.service.js";

const getHostedRoom = async (req, res) => {
    const { status, message, error, data } = await getHostedRoomService(req, res);
    if (data) {
        res.status(status).json({
            status: status,
            message: message,
            data: data
        })
    }
    else {
        res.status(status).json({
            status: status,
            message: message,
            error: error
        })
    }
}

export { getHostedRoom }