import express from "express";
import { getHostedRoom, updateUserName } from "../controllers/User.controller.js";
import { update } from "../controllers/User.controller.js";
import multer from "multer";
import { checkPermission } from "../middleware/checkPermission.js";
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get("/host", upload.single('file'), getHostedRoom)
router.post("/update", update)
router.post("/updateName", updateUserName)
export default router;