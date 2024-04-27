import User from '../models/User.js';

export default async function Authentication(req, res, next) {
    if (req.session && req.cookies.userId) {
        const user = await User.findById(req.cookies.userId);
        if (user.role === 'ADMIN') {
            return next();
        }
    }
    return res.status(403).send({message: 'Access denied'});
};