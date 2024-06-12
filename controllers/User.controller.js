import { getHostedRoomService, updateService, updateUserNameService } from "../services/User.service.js";

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

const update = async (req, res) => {
    const { status, message, error, data } = await updateService(req, res);
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

const updateUserName = async (req, res) => {
    const { status, message, error, data } = await updateUserNameService(req, res);
    if (data) {
        res.status(status).json({
            status: status,
            message: message,
            data: data
        })
    }
    else if (status == 404) {
        res.status(status).json({
            status: status,
            message: message
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
export { getHostedRoom, update, updateUserName }