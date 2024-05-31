import express from "express";
import { booking, cancelTrip, getTrip } from "../controllers/Booking.controller.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();

router.post('/bookRoom', checkPermission, booking)
router.get('/getTrip', checkPermission, getTrip)
router.delete('/cancelTrip', checkPermission, cancelTrip)
export default router;