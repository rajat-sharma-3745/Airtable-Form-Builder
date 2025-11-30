import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import User from '../models/User.js'


export const auth = async (req, res, next) => {
    try {
        const token = req.cookies['token'];
        if(!token) return next(new ApiError('Not authorized, no token provided, login again',401))
       
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded?.id) {
            return next(new ApiError('Invalid token payload', 401))
        }
        const user = await User.findById(decoded?.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;

        next();

    } catch (error) {
        console.error('Token verification failed:', error.message);
        return next(new ApiError('Token verification failed', 401))
    }
}