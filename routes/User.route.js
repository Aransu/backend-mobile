import express from "express";
import { getHostedRoom } from "../controllers/User.controller.js";

const router = express.Router();

router.get("/host", getHostedRoom)

export default router;