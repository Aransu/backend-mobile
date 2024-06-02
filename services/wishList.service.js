
import roomModel from "../models/room.model.js";
import userModel from "../models/user.model.js";
import WishList from "../models/wishList.model.js";
import User from "../models/user.model.js";
const addToWishListService = async (req, res) => {
    const { user_id, room_id } = req.body;
    if (!user_id || !room_id) {
        return {
            status: 400,
            message: "Missing fields"
        }
    }
    const user = userModel.findOne({ _id: user_id })
    const room = roomModel.findOne({ _id: room_id })
    if (!user || !room) {
        return {
            status: 404,
            message: "Not found"
        }
    }
    try {
        const wishList = new WishList({
            user_id,
            room_id
        })
        const wishLists = await WishList.find({ user_id })
        const existsWishList = wishLists.some(wishList => wishList.room_id === room_id);
        console.log(existsWishList)
        if (existsWishList)
            return ({
                status: 409,
                message: "CONFLICT"
            })
        await wishList.save();
        return ({
            status: 201,
            message: "CREATED",
            data: wishList
        })
    } catch (err) {
        return ({
            status: 400,
            message: "An error occur",
            error: err.message
        })
    }
}

const getWishListService = async (req, res) => {
    const { user_id } = req.query;
    if (!user_id) {
        return {
            status: 400,
            message: "Missing user_id"
        };
    }

    try {
        const wishLists = await WishList.find({ user_id }).lean();

        if (wishLists.length === 0) {
            return {
                status: 404,
                message: "No wish lists found for this user"
            };
        }
        const updatedWishLists = await Promise.all(wishLists.map(async wishList => {
            const room = await roomModel.findOne({ _id: wishList.room_id }).lean();
            return { ...wishList, room };
        }));

        const addedUserWishLists = await Promise.all(updatedWishLists.map(async wishList => {
            const user = await User.findOne({ _id: wishList.user_id }).lean();
            console.log(wishList.user_id)
            return { ...wishList, user };
        }));

        return {
            status: 200,
            message: "Success",
            data: addedUserWishLists
        };
    } catch (err) {
        return {
            status: 500,
            message: "An error occurred",
            error: err.message
        };
    }
};

const removeWishListService = async (req, res) => {
    const { user_id, room_id } = req.query;
    if (!user_id || !room_id) {
        return {
            status: 400,
            message: "Missing fields"
        };
    }

    try {
        const wishListEntry = await WishList.findOneAndDelete({ user_id, room_id });

        if (!wishListEntry) {
            return {
                status: 404,
                message: "Not found"
            };
        }

        return {
            status: 200,
            message: "DELETED",
            data: wishListEntry
        };
    } catch (err) {
        return {
            status: 500,
            message: "An error occurred",
            error: err.message
        };
    }
};
export { addToWishListService, getWishListService, removeWishListService };