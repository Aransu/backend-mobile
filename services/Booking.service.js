import reservations from "../models/reservations.model.js";
import User from '../models/user.model.js'
import Room from '../models/room.model.js'
import roomModel from "../models/room.model.js";
import crypto from 'crypto';
import https from 'https';
import axios from "axios";
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
        const room = await Room.findOne({ _id: room_id })
        const total = daysDiff * room.price;
        const newReservations = new reservations({
            user_id,
            room_id,
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
const getTripService = async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) {
            return ({
                status: 400,
                message: "Missing fields"
            });
        }

        const trips = await reservations.find({ user_id }).lean();
        if (!trips || trips.length === 0) {
            return ({
                status: 200,
                message: "Trip is empty",
                data: []
            });
        }

        const updatedTrips = await Promise.all(trips.map(async trip => {
            const room = await roomModel.findOne({ _id: trip.room_id }).lean();
            return { ...trip, room };
        }));

        const addedUserTrips = await Promise.all(updatedTrips.map(async trip => {
            const user = await User.findOne({ _id: trip.user_id }).lean();
            return { ...trip, user };
        }));

        return ({
            status: 200,
            message: "SUCCESS",
            data: addedUserTrips
        });
    } catch (err) {
        return ({
            status: 500,
            message: "An error occurred",
            error: err.message
        });
    }
};


const cancelTripService = async (req, res) => {
    try {
        const { trip_id } = req.query;
        if (!trip_id) {
            return {
                status: 400,
                message: "Missing trip_id"
            };
        }

        const trip = await reservations.findOneAndDelete({ _id: trip_id });
        if (!trip) {
            return {
                status: 404,
                message: "Trip not found"
            };
        }

        return {
            status: 200,
            message: "Trip cancelled successfully",
            data: trip
        };
    } catch (err) {
        return {
            status: 500,
            message: "An error occurred",
            error: err.message
        };
    }
};



const momoPaymentService = async (req, res) => {
    const { order_id, total } = req.body;
    const accessKey = "F8BBA842ECF85";
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const orderInfo = "Thanh toán tiền phòng";
    const partnerCode = "MOMO";
    const partnerName = "The Coffee Shop C22";
    const redirectUrl = "https://momo.vn";
    const ipnUrl = "https://2ddd-125-235-239-154.ngrok-free.app/api/v1/booking/callback";
    const requestType = "captureWallet";
    const amount = total;
    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;
    const extraData = ""; // Empty string if there is no extra data
    const orderGroupId = ""; // Optional field, if not required, leave it as an empty string
    const autoCapture = true;
    const lang = "vi";

    // Generate raw signature
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    console.log("--------------------RAW SIGNATURE----------------");
    console.log(rawSignature);

    // Create signature using HMAC SHA256
    const signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");
    console.log("--------------------SIGNATURE----------------");
    console.log(signature);

    // JSON object to send to MoMo endpoint
    const requestBody = {
        partnerCode: partnerCode,
        partnerName: partnerName,
        storeId: "MomoTestStore",
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        lang: lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData: extraData,
        orderGroupId: orderGroupId,
        signature: signature,
    };

    console.log("--------------------REQUEST BODY----------------");
    console.log(requestBody);

    const options = {
        method: "POST",
        url: "https://test-payment.momo.vn/v2/gateway/api/create",
        headers: {
            "Content-Type": "application/json",
        },
        data: requestBody,
    };

    try {
        const result = await axios(options);
        return res.json({
            status: "success",
            data: result.data,
        });
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        return res.json({
            status: "error",
            msg: "server error",
            error: error.response ? error.response.data : error.message,
        });
    }
}
const callBackService = async (req, res) => {
    console.log("callback: "),
        console.log(req.body);
    return res.status(200).json(req.body);
}


export { bookingService, getTripService, cancelTripService, momoPaymentService, callBackService };