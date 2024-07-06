import express from "express";
import { booking, cancelTrip, getTrip, momoPayment } from "../controllers/Booking.controller.js";
import { checkPermission } from "../middleware/checkPermission.js";
import { callBackService, momoPaymentService } from "../services/Booking.service.js";

const router = express.Router();

router.post('/bookRoom', checkPermission, booking)
router.get('/getTrip', checkPermission, getTrip)
router.delete('/cancelTrip', checkPermission, cancelTrip)
router.post('/payment', momoPaymentService)
router.post('/callback', callBackService)
export default router;