import User from '../models/User.js';
import Note from '../models/Note.js';
import Collection from '../models/Collection.js';
const adminController = {};

adminController.getAllUsers = async (req, res) => {
    const users = await User.find({ role: 'USER' }, '_id user');
    return res.send({ users: users });
};

adminController.removeUser = async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).send({ ok: false, message: 'Bad request' });
    }
    try {
        const notes = await Note.find({ user: userId }, '');
        for (let i = 0; i < notes.length; i++) {
            await Note.findByIdAndDelete(notes[i].id);
        }
        const collections = await Collection.find({ user: userId });
        for(let i = 0; i < collections.length; i++){
            await Collection.findByIdAndDelete(collections[i].id);
        }
        await User.findByIdAndDelete(userId);
        return res.status(200).send({ ok: true });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

adminController.getAllUserNotes = async (req, res) => {
    try {
        const { userId } = req.params;
        let allNotes = await Note.find({ user: userId }, '_id title');
        allNotes = allNotes.map(note => ({
            ...note.toObject(),
            type: 'note',

        }));
        if (!allNotes || allNotes.length === 0) {
            return res.status(404).json({ message: 'No notes found' });
        }
        res.status(200).json({ notes: allNotes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

adminController.getAllUserCollections = async (req, res) => {
    try {
        const { userId } = req.params;
        let allCollections = await Collection.find({ user: userId }, '_id name');
        allCollections = allCollections.map(note => ({
            ...note.toObject(),
            type: 'collection',
            title: note.name,
            name: undefined
        }));
        if (!allCollections || allCollections.length === 0) {
            return res.status(404).json({ message: 'No collections found' });
        }
        res.status(200).json({ collections: allCollections });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

adminController.getAllUserFriends = async (req, res) => {
    try {
        const { userId } = req.params;
        let allFriends = await User.find({ _id: userId }, '_id friends');
        allFriends = allFriends.map(note => ({
            ...note.toObject(),
            type: 'friends',
        }));
        if (!allFriends[0].friends) {
            return res.status(200).json({ message: 'No friends found' });
        }
        res.status(200).json({ friends: allFriends });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

adminController.createNote = async (req, res) => {
    try {
        const { userId } = req.params;
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ error: "No title found" });
        }
        const newNote = new Note({ title: title, user: userId });
        await newNote.save();
        return res.status(201).json({ message: 'Note inserted successfully!', _id: newNote.id });
    } catch (err) {
        return res.status(500).send({ message: err });
    }
};

adminController.removeNote = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'No note ID provided' });
        }
        const collections = await Collection.find({
            'notes': {
                $elemMatch: {
                    id: id
                }
            }
        });

        collections.forEach(async (element) => {
            await Collection.updateOne(
                { _id: element.id },
                { $pull: { notes: { id: id } } }
            );
        })
        await Note.findByIdAndDelete(id);
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

adminController.createCollection = async (req, res) => {
    const { name } = req.body;
    const { userId } = req.params;
    if (!name || !userId) {
        res.status(400).send({ ok: false, message: 'Bad Request' });
        return;
    }
    const newCollection = new Collection({ name: name, user: userId });
    await newCollection.save();
    return res.status(201).send({ ok: true });
};

adminController.removeCollection = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).send({ ok: false, message: 'Bad Request' });
        }
        await Collection.findByIdAndDelete(id);
        return res.status(202).send({ ok: true });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

adminController.addFriends = async (req, res) => {
    const { userId } = req.params;
    const { title, id } = req.body;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(400).send({ ok: false, message: 'Bad request' });
    }
    user.friends.push({ friendId: id, title: title });
    await user.save();
    return res.status(200).send({ ok: true });
};

adminController.removeFriends = async (req, res) => {
    const { userId } = req.params;
    const { friendId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(400).send({ ok: false, message: 'Bad request' });
    }
    user.friends.map(async (friend) => {
        if(friend.id === friendId) {
            user.friends.splice(user.friends.indexOf(friend), 1);
            await user.save();
        }
    });
    return res.status(200).send({ ok: true });
};

export default adminController;