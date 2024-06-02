import jwt, { decode } from "jsonwebtoken"
import dotenv from "dotenv"
import User from "../models/user.model.js"
dotenv.config()
const { JWT_KEY } = process.env;
export const checkPermission = async (req, res, next) => {
    try {
        if (!req.header('authorization')) {
            return res.status(400).json({
                message: "Missing token"
            })
        }
        const token = req.header('authorization').split(" ")[1];
        if (!token) {
            return res.status(403).json({
                message: "Not logged in"
            });
        }
        const decoded = jwt.verify(token, JWT_KEY)
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(403).json({
                message: "Token error or missing Token"
            })
        }
        next();
    } catch (err) {
        return res.status(500).json({
            name: err.name,
            message: err.message
        })
    }
}