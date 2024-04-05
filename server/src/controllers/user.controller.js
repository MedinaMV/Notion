import User from '../models/User.js';
const userController = {};

userController.register = async (req, res) => {
    const { user, email, password, confirm_password } = req.body;
    if(password != confirm_password) {
        res.status(400).send({message: 'Password do not match'});
    }
    const existingUser = await User.findOne({email: email});
    if(existingUser){
        res.status(400).send({message: 'User already exists'});
    }else {
        const newUser = new User({user,email,password});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        res.status(200).send({message: 'User register successfully'});
    }
};

userController.logIn = (req, res) => {

};

userController.logOut = (req, res) => {

};

export default userController;