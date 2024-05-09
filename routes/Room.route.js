import express from "express";
import { addImageToRoom, addRoom, getRoom, getRoomInfo } from "../controllers/Room.controller.js";
import { checkPermission } from "../middleware/checkPermission.js";
import { addImageUrlToRoom, addRoomFromStringService } from "../services/Room.service.js";


const router = express.Router();


router.post('/addRoom', checkPermission, addRoom)
router.post('/addImageToRoom', checkPermission, addImageToRoom)
router.post('/addRoomFromString', addRoomFromStringService)
router.post('/addImageUrl', addImageUrlToRoom)
router.get('/getRoomInfo', getRoomInfo)
router.get('/getRoom', getRoom)

export default router;