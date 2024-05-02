import User from '../models/User.js';
import Collection from '../models/Collection.js';
import Note from '../models/Note.js';
import mongoose from 'mongoose';
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
    user.mailbox.push({ sender: friendUser.user });

    // Add each other to friends list
    user.friends.push({ name: friendUser.user, id: friendUser._id });
    friendUser.friends.push({ name: user.user, id: user._id });

    await friendUser.save();
    await user.save();
    return res.status(200).send({ ok: true, message: 'Friend request sent' });
};

userController.removeFriend = async (req, res) => {
    const { userId } = req.cookies;
    const { friend } = req.body;

    const user = await User.findById(userId);
    const friendUser = await User.findOne({ user: friend });

    if (!user || !friendUser) {
        return res.status(404).send({ ok: false, message: 'User not found' });
    }

    const friendIndex = user.friends.findIndex(f => f.name === friend);
    if (friendIndex === -1) {
        return res.status(404).send({ ok: false, message: 'Friend not found' });
    }

    user.friends.splice(friendIndex, 1);

    // Remove user from friend's friends list
    const userIndexInFriend = friendUser.friends.findIndex(f => f.name === user.user);
    if (userIndexInFriend !== -1) {
        friendUser.friends.splice(userIndexInFriend, 1);
    }

    // Remove user from friend's mailbox
    const userIndexInMailbox = friendUser.mailbox.findIndex(m => m.sender === user.user);
    if (userIndexInMailbox !== -1) {
        friendUser.mailbox.splice(userIndexInMailbox, 1);
    }

    // Remove friend from user's mailbox
    const friendIndexInMailbox = user.mailbox.findIndex(m => m.sender === friend);
    if (friendIndexInMailbox !== -1) {
        user.mailbox.splice(friendIndexInMailbox, 1);
    }

    // Find and update shared notes
    const sharedNotes = await Note.find({ 'shared.user': userId });
    sharedNotes.forEach(note => {
        const sharedUserIndex = note.shared.findIndex(u => u.user === friend);
        if (sharedUserIndex !== -1) {
            note.shared.splice(sharedUserIndex, 1);
            note.save();
        }
    });

    // Find and update shared collections
    const sharedCollections = await Collection.find({ 'shared.user': userId });
    sharedCollections.forEach(collection => {
        const sharedUserIndex = collection.shared.findIndex(u => u.user === friend);
        if (sharedUserIndex !== -1) {
            collection.shared.splice(sharedUserIndex, 1);
            collection.save();
        }
    });

    await user.save();
    await friendUser.save();
    return res.status(200).send({ ok: true, message: 'Friend removed and access to shared notes and collections revoked' });
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
    if (flag === 1) {
    const friend = {
        _id: new mongoose.Types.ObjectId(),
        name: user.mailbox[requestIndex].sender,
        id: user.mailbox[requestIndex]._id
    };
    user.friends.push(friend);
}
    user.mailbox.splice(requestIndex, 1);
    await user.save();
    return res.status(200).send({ ok: true, user });
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