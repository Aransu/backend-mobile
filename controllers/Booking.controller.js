import { bookingService, getTripService, cancelTripService } from "../services/Booking.service.js";

const booking = async (req, res) => {
    const { reservations } = await bookingService(req, res);
    if (reservations) {
        res.status(201).json({
            status: "SUCCESS",
            message: "Booking success",
            data: reservations
        });
    }
}
const getTrip = async (req, res) => {
    const { status, message, error, data } = await getTripService(req, res);
    if (status === 200) {
        res.status(status).json({
            status,
            message,
            data
        });
    } else if (status === 400 && !error) {
        res.status(status).json({
            status,
            message
        });
    } else if (error) {
        res.status(status).json({
            status,
            message,
            error
        });
    } else {
        res.status(status).json({
            status,
            message
        });
    }
};

const cancelTrip = async (req, res) => {
    const { status, message, error, data } = await cancelTripService(req, res);
    if (status === 200) {
        res.status(status).json({
            status,
            message,
            data
        });
    } else if (status === 400 && !error) {
        res.status(status).json({
            status,
            message
        });
    } else if (error) {
        res.status(status).json({
            status,
            message,
            error
        });
    } else {
        res.status(status).json({
            status,
            message
        });
    }
};

export { booking, getTrip, cancelTrip }