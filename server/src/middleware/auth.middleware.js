import User from '../models/User.js';

export default async function Authentication(req, res, next) {
    console.log(req.session);
    if (req.session && req.session.userId) {
        const user = await User.findById(req.session.userId);
        if (user.role === 'USER') {
            return next();
        }
    }
    return res.status(403).send({message: 'Access denied'});
};