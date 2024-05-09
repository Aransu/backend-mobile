import Room from "../models/room.model.js"
import User from "../models/user.model.js"
import Reservations from "../models/reservations.model.js"
import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"


const addRoomService = async (req, res) => {
    const { name,
        summary,
        transit,
        house_rules,
        host_id,
        street,
        smart_location,
        country,
        latitude,
        longitude,
        room_type,
        bathRooms,
        bedRooms,
        beds,
        price,
        weekly_price,
        image_url,
        review } = req.body;
    // if (!name || !summary || !house_rules || !transit || !req.files.image.tempFilePath || !host || !street || !smart_location || !country || !latitude
    //     || !longitude || !room_type || !bathRooms || !bedRooms || !beds || !price || !weekly_price) {
    //     return res.status(400).json({
    //         status: "FAILED",
    //         message: "Missing fields"
    //     });
    // }
    try {
        const host = await User.findOne({ _id: host_id })
        console.log(host)
        const newRoom = new Room({
            name,
            summary,
            transit,
            house_rules,
            host,
            street,
            smart_location,
            country,
            latitude,
            longitude,
            room_type,
            bathRooms,
            bedRooms,
            beds,
            price,
            weekly_price,
            review,
            thumbnail_urls: [],
            created_at: Date.now()
        });
        const savedRoom = await newRoom.save();
        return {
            room: savedRoom,
            status: 201,
            message: "Room created"
        }

    } catch (err) {
        return {
            status: 400,
            message: "an error occur",
            err: err.message
        }
    }
}

const getRoomService = async (req, res) => {
    try {
        const { room_type, smart_location, min_price, max_price, is_sort_price } = req.query;
        const query = {};

        if (room_type) query.room_type = room_type;
        if (smart_location) query.smart_location = smart_location;
        if (min_price || max_price) {
            query.price = {}; // Tạo một object trống cho trường price
            if (min_price) query.price.$gte = min_price;
            if (max_price) query.price.$lte = max_price;
        }

        console.log(query);
        let result = await Room.find(query);

        if (is_sort_price == "ASC") result.sort({ price: 1 });
        else if (is_sort_price == "DESC") result.sort({ price: -1 });

        return {
            status: 200,
            message: "SUCCESS",
            rooms: result
        };

    }
    catch (err) {
        return { err: err.message, status: 400, message: "An error occur" }
    }
}

const getRoomInfoService = async (req, res) => {
    const { room_id } = req.query
    try {
        const room = await Room.findOne({ _id: room_id })
        const booked = await Reservations.find({ room: room })
        let allDates = [Date];
        allDates.shift();
        const today = new Date();
        booked.forEach(reservation => {
            const startDate = new Date(reservation.start_date);
            const endDate = new Date(reservation.end_date);
            for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {

                if (date.getTime() >= today.getTime()) {
                    allDates.push(new Date(date));
                }
            }
        })
        return { room, allDates, status: 200, message: "SUCCESS" }
    }
    catch (err) {
        return {
            status: 400,
            message: "An error occur",
            error: err.message
        }
    }
}

const addImageToRoomService = async (req, res) => {
    const { room_id } = req.body;
    let image = ""
    try {
        const file = req.files.image.tempFilePath
        console.log(file)
        const result = await cloudinary.uploader.upload(
            file,
            {
                use_filename: true,
                folder: 'upload',
            }
        )
        fs.unlinkSync(file)
        image = result.secure_url;
        const room = await Room.findOne({ _id: room_id })
        if (!room)
            return {
                status: 404,
                message: "Room not found"
            }
        room.thumbnail_urls.push(image)
        await room.save();
        return {
            status: 200,
            message: "Added image to room",
            room: room
        }
    } catch (err) {
        return {
            status: 400,
            message: "An error occur",
            error: err.message
        }
    }
}

const addRoomFromStringService = async (req, res) => {
    const { jsonString } = req.body;
    const jsonObject = JSON.parse(jsonString);
    console.log(jsonObject)
    jsonObject.host_id = "663743116fa6671619d801f7"
    const host = await User.findOne({ _id: jsonObject.host_id })
    const newRoom = new Room({
        name: jsonObject.name,
        summary: jsonObject.summary,
        transit: jsonObject.transit,
        house_rules: jsonObject.house_rules,
        host: host,
        street: jsonObject.street,
        smart_location: jsonObject.smart_location,
        country: jsonObject.country,
        latitude: jsonObject.latitude,
        longitude: jsonObject.longitude,
        room_type: jsonObject.room_type,
        bathRooms: jsonObject.bathRooms,
        bedRooms: jsonObject.bedRooms,
        beds: jsonObject.beds,
        price: jsonObject.price,
        weekly_price: jsonObject.weekly_price,
        thumbnail_urls: [],
        created_at: Date.now()
    });
    await newRoom.save()
    newRoom.thumbnail_urls.push(jsonObject.thumbnail_url)
    await newRoom.save()
    res.status(200).json({
        Status: "SUCCESS"
    })
}

const addImageUrlToRoom = async (req, res) => {
    const { url, room_id } = req.body
    const room = await Room.findOne({ _id: room_id })
    room.thumbnail_urls.push(url)
    await room.save()
    res.status(200).json({
        Status: "Success"
    })
}
export { addImageUrlToRoom, addRoomService, getRoomService, getRoomInfoService, addImageToRoomService, addRoomFromStringService }