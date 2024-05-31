import express from 'express';
import { addToWishList, getWishList, removeWishList } from '../controllers/WishLish.controller.js';
import { checkPermission } from '../middleware/checkPermission.js';
const router = express.Router();


router.post('/addWishList', checkPermission, addToWishList)
router.get('/getWishList', checkPermission, getWishList)
router.delete('/removeWishList', checkPermission, removeWishList)
export default router;