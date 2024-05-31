import { addToWishListService, getWishListService, removeWishListService } from "../services/wishList.service.js"


const addToWishList = async (req, res) => {
    const { status, message, error, data } = await addToWishListService(req, res);
    if (status == 201) {
        res.status(status).json({
            status,
            message,
            data
        })
    }
    else if (status == 400 && !error) {
        res.status(status).json({
            status,
            message
        })
    }
    else if (error) {
        res.status(status).json({
            status,
            message,
            error
        })
    }
}


const getWishList = async (req, res) => {
    const { status, message, error, data } = await getWishListService(req, res);
    if (status === 200) {
        res.status(status).json({
            status,
            message,
            data
        });
    } else if (status === 400 && !error) {
        res.status(status).json({
            status,
            message
        });
    } else if (error) {
        res.status(status).json({
            status,
            message,
            error
        });
    } else {
        res.status(status).json({
            status,
            message
        });
    }
};

const removeWishList = async (req, res) => {
    const { status, message, error, data } = await removeWishListService(req, res);
    if (status === 200) {
        res.status(status).json({
            status,
            message,
            data
        });
    } else if (status === 400 && !error) {
        res.status(status).json({
            status,
            message
        });
    } else if (error) {
        res.status(status).json({
            status,
            message,
            error
        });
    } else {
        res.status(status).json({
            status,
            message
        });
    }
};
export { addToWishList, getWishList, removeWishList };