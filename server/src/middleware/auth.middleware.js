import User from '../models/User.js';
import cookieParser from 'cookie-parser';

export default async function Authentication(req, res, next) {
    if (req.session && req.cookies.userId) {
        const user = await User.findById(req.cookies.userId);
        if (user.role === 'USER') {
            return next();
        }
    }
    return res.status(403).send({message: 'Access denied'});
};