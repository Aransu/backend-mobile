import User from "../models/user.model.js";
import Room from "../models/room.model.js"
import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer';
import fs from "fs"
const upload = multer({ dest: 'public/uploads/' }).single('file');
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

const updateService = async (req, res) => {
    const { id } = req.body
    const file = req.files.file.tempFilePath
    console.log("Update Profile")
    let image = "";
    try {
        const result = await cloudinary.uploader.upload(
            file,
            {
                use_filename: true,
                folder: 'upload',
            }
        )
        fs.unlinkSync(file)
        image = result.secure_url;
        console.log(image);
        const user = await User.findOne({ _id: id })
        console.log(user)
        user.profile_image = image;
        await user.save();
        return { status: 200, message: "SUCCESS", data: user }
    } catch (err) {
        return { status: 400, message: "An error occur", error: err.message }
    }

}
const updateUserNameService = async (req, res) => {
    const { id, name } = req.body;
    console.log(req.body)
    try {
        const user = await User.findOne({ _id: id });


        if (!user) {
            return { status: 404, message: "User not found" };
        }

        user.name = name;

        await user.save();

        return { status: 200, message: "SUCCESS", data: user };
    } catch (err) {
        return { status: 400, message: "An error occurred", error: err.message };
    }
};

export { getHostedRoomService, updateService, updateUserNameService }