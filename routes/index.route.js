import express from 'express';
import authRouter from './Auth.route.js'
import bookingRouter from './Booking.route.js'
import roomRouter from "./Room.route.js"
import userRouter from "./User.route.js"
import wishListRouter from './wishList.route.js'
const router = express.Router()

router.use('/auth', authRouter)
router.use('/booking', bookingRouter)
router.use('/room', roomRouter)
router.use('/user', userRouter)
router.use('/wishList', wishListRouter)
export default router