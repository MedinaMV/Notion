import User from '../models/User.js';
const userController = {};

userController.register = async (req, res) => {
    const { user, email, password, confirm_password } = req.body;

    if (!user || !email || !password || !confirm_password) {
        res.status(400).send({ ok: false, message: 'All fields are required' });
        return;
    }

    if (password != confirm_password) {
        res.status(400).send({ ok: false, message: 'Passwords does not match' });
    } else {
        const existingUser = await User.findOne({ email: email, user: user });
        if (existingUser) {
            res.status(400).send({ ok: false, message: 'User already registered' });
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
    const user = await User.findOne({ email });
    if (user) {
        const match = await user.matchPassword(password);
        if (match) {
            req.session.userId = user.id;
            res.status(200).send({ ok: true, user: user.id });
        } else {
            res.status(400).send({ ok: false, message: 'Incorrect combination of Email or Password.' });
        }
    } else {
        res.status(400).send({ ok: false, message: 'User not found.' });
    }
};

/* TODO: Cristian 
*
* Buscar al usuario que recibe la petición de amistad mediante  
* su nombre y agregar una petición de amistad a su "mailbox". 
* El mailbox contiene el nombre del que envia la petición.
*
*/
userController.addFriend = async (req, res) => {
    // Id del usuario que realiza la petición de amistad.
    const { userId } = req.cookies;
    // Nombre del usuario que recibe la petición de amistad.
    const { friend } = req.body;
};

/* TODO: Cristian 
*
* Obtener todos los amigos de un usuario.
*
*/
userController.getAllFriends = async (req, res) => {
    // El usuario
    const { userId } = req.cookies;
};

/* TODO: Cristian 
* 
* Buscar la petición dentro del mailbox de un usuario y
* aceptar (flag = 1) o rechazar (flag = 0) la petición.
* En ambos casos se borra la petición dentro del mailbox.
*
*/
userController.manageFriendRequest = async (req, res) => {
    // Id del usuario del que hay que devolver el mailbox.
    const { userId } = req.cookies;
    // Id de la petición de amistad y flag.
    const { requestId, flag } = req.body;
};

/* TODO: Cristian 
* 
* Devolver el mailbox de un usuario dado. (id y sender)
*  
*/
userController.getAllFriendRequests = async (req, res) => {
    // Id del usuario del que hay que devolver el mailbox.
    const { userId } = req.cookies;
};

export default userController;