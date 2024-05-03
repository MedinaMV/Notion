import User from '../models/User.js';
import Note from '../models/Note.js';
import Collection from '../models/Collection.js';
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
            res.status(200).send({ ok: true, user: user.id, role: user.role });
        } else {
            res.status(400).send({ ok: false, message: 'Incorrect combination of Email or Password.' });
        }
    } else {
        res.status(400).send({ ok: false, message: 'User not found.' });
    }
};

userController.removeFriend = async (req, res) => {
    const { userId } = req.cookies;
    const { friend } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).send({ ok: false, message: 'User not found' });
    }

    const friendIndex = user.friends.findIndex(f => f.title === friend);
    if (friendIndex === -1) {
        return res.status(404).send({ ok: false, message: 'Friend not found' });
    }

    user.friends.splice(friendIndex, 1);

    const userFriend = await User.findOne({user: friend});
    const sharedNotes = await Note.find({ 'shared.user': userFriend.id });
    sharedNotes.forEach(note => {
        const sharedUserIndex = note.shared.findIndex(u => u.user === userFriend.id);
        if (sharedUserIndex !== -1) {
            note.shared.splice(sharedUserIndex, 1);
            note.save();
        }
    });

    await user.save();
    return res.status(200).send({ ok: true, message: 'Friend removed' });
};

/* TODO: Cristian 
*
* Buscar al usuario que recibe la petición de amistad mediante  
* su nombre y agregar una petición de amistad a su "mailbox". 
* El mailbox contiene el nombre del que envia la petición.
*
*/
userController.addFriend = async (req, res) => {
    const { userId } = req.cookies;
    const { friend } = req.body;

    const friendUser = await User.findOne({ user: friend });
    if (!friendUser) {
        return res.status(404).send({ ok: false, message: 'User not found' });
    }
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).send({ ok: false, message: 'User not found' });
    }
    friendUser.mailbox.push({ sender: user.user });
    await friendUser.save();
    return res.status(200).send({ ok: true, message: 'Friend request sent' });
};

/* TODO: Cristian 
*
* Obtener todos los amigos de un usuario.
*
*/
userController.getAllFriends = async (req, res) => {
    const { userId } = req.cookies;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).send({ ok: false, message: 'User not found' });
    }
    const friends = user.friends;
    return res.status(200).send({ ok: true, friends });
};

/* TODO: Cristian 
* 
* Buscar la petición dentro del mailbox de un usuario y
* aceptar (flag = 1) o rechazar (flag = 0) la petición.
* En ambos casos se borra la petición dentro del mailbox.
*
*/
userController.manageFriendRequest = async (req, res) => {
    const { userId } = req.cookies;
    const { requestId, flag } = req.body;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).send({ ok: false, message: 'User not found' });
    }
    const requestIndex = user.mailbox.findIndex(request => request._id.toString() === requestId);
    if (requestIndex === -1) {
        return res.status(404).send({ ok: false, message: 'Friend request not found' });
    }
    const friendName = user.mailbox[requestIndex].sender;
    const friend = await User.findOne({user: friendName});
    if (flag === 1) {
        user.friends.push({friendId: friend.id, title: friendName });
        user.mailbox.splice(requestIndex, 1);
        friend.friends.push({friendId: user.id, title: user.user })
        await user.save();
        await friend.save();
        return res.status(200).send({ ok: true, message: 'Request accepted' });
    }
    user.mailbox.splice(requestIndex, 1);
    await user.save(); 
    return res.status(200).send({ ok: true, message: 'Request rejected' });
};

/* TODO: Cristian 
* 
* Devolver el mailbox de un usuario dado. (id y sender)
*  
*/
userController.getAllFriendRequests = async (req, res) => {
    const { userId } = req.cookies;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).send({ ok: false, message: 'User not found' });
    }
    const mailbox = user.mailbox;
    return res.status(200).send({ ok: true, mailbox });
};

export default userController;