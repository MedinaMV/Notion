import User from '../models/User.js';
const userController = {};

userController.register = async (req, res) => {
    const { user, email, password, confirm_password } = req.body;

    if(!user || !email || !password || !confirm_password){
        res.status(400).send({ok: false, message: 'All fields are required'});
        return;
    }

    if (password != confirm_password) {
        res.status(400).send({ ok: false, message: 'Passwords does not match' });
    } else {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            res.status(400).send({ ok: false, message: 'Email already registered' });
        } else {
            const newUser = new User({ user, email, password });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            res.status(200).send({ ok: true });
        }
    }
};

userController.logIn = async (req, res) => {
    const { email, password } = req.body;
    let message = false;
    const user = await User.findOne({email});
    if(user) {
        const match = await user.matchPassword(password);
        if(match) {
            message = true;
        }
    }
    if(message) {
        res.status(200).send({ ok: true, user: user.id});
    }else {
        res.status(400).send({ok: false, message: 'Incorrect combination of Email or Password.'});
    }
};

export default userController;